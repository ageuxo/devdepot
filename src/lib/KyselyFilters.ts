import { SelectQueryBuilder, sql, SqlBool, Expression } from "kysely";

export type DBFilter =
      { type: 'and', filters: DBFilter[] }
    | { type: 'or', filters: DBFilter[] }
    | { type: 'not', filter: DBFilter }
    | { type: 'condition', field: string, op: 'eq' | 'like' | 'in' | 'gte' | 'lte', value: any }
    | { type: 'exists', from: string, join?: { table:string, on: string }, filters: DBFilter[] }

export function filterQueryResolver<DB, TB extends keyof DB, O>(qb: SelectQueryBuilder<DB, TB, O>, filter: DBFilter, aggregates: string[]): SelectQueryBuilder<DB, TB, O> {
    const expr = buildFilterExpression(filter);
    const useHaving = isAggregateFilter(filter, aggregates);

    return applyFilterExpression(qb, expr, useHaving);
}

export function buildFilterExpression(filter: DBFilter): Expression<SqlBool> {
    switch (filter.type) {
        case 'condition': {
            const column = sql.ref(filter.field);

            switch (filter.op) {
                case 'eq': return sql`${column} = ${filter.value}`
                case 'like': return sql`${column} LIKE ${filter.value}`
                case 'in': return sql`${column} IN (${sql.join(filter.value)})`
                case 'gte': return sql`${column} >= ${filter.value}`
                case 'lte': return sql`${column} <= ${filter.value}`
                default:
                    throw new Error(`Attempted building filter expression with unknown operator: ${filter.op}`);
            }
        }

        case "not": {
            const inner = buildFilterExpression(filter.filter);
            return sql`NOT (${inner})`;
        }
        
        case "and":
        case "or": {
            if (filter.filters.length === 0) {
                return sql`1 = 1`; // if empty, return a filter that always returns true
            }

            const op = sql.raw(filter.type.toUpperCase());
            const expressions = filter.filters.map(f => buildFilterExpression(f));

            return expressions.reduce((acc, expr) => {
                return acc ? sql`${acc} ${op} ${expr}` : expr
            }) as Expression<SqlBool>;

        }

        case "exists": {
            // Build inner subquery
            const inner = filter.filters.length > 0
            ? filter.filters.map(f => buildFilterExpression(f)).reduce((acc, expr)=>
                    acc ? sql`${acc} AND ${expr}` : expr
                )
            : sql`1=1` // if empty, return a filter that always returns true

            // Build exists query
            return sql`EXISTS (
                SELECT 1
                FROM ${sql.ref(filter.from)}
                ${filter.join ? sql`JOIN ${sql.ref(filter.join.table)} ON ${sql.raw(filter.join.on)}` : sql`` }
                WHERE ${inner}
            )`;
        }
    }
}

export function isAggregateFilter(filter: DBFilter, aggregates: string[]): boolean {
    switch (filter.type) {
        case "condition":
            return aggregates.some(prefix => filter.field.startsWith(prefix));
        case "not":
            return isAggregateFilter(filter.filter, aggregates);
        case "and":
        case "or":
            return filter.filters.some(f => isAggregateFilter(f, aggregates));
        case "exists":
            return false;
    }
}

export function applyFilterExpression<DB, TB extends keyof DB, O>(qb: SelectQueryBuilder<DB, TB, O>, expr: Expression<SqlBool>, useHaving: boolean ) {
    return useHaving ? qb.having(expr) : qb.where(expr);
}