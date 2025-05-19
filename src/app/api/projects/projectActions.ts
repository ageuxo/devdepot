'use server'

import { DB, Project } from "kysely-codegen"
import { db } from "./route"
import { FieldName, FieldValues } from "react-hook-form"
import { ExpressionBuilder, SelectQueryBuilder } from "kysely"



const FilterCheckType = {
    EQUAL: '=',
    GREATER_THAN: '>',
    LESS_THAN: '<',
    IN_RANGE: 'in_range',
} as const;
type FilterCheck = typeof FilterCheckType[keyof typeof FilterCheckType];

interface ColumnFilter<T extends FieldValues> {
    column: any,
    type: FilterCheck,
    value: string | string[]
}

const GroupType = {
    AND: 'and',
    OR: 'or'
} as const;
type GroupType = typeof GroupType[keyof typeof GroupType];

interface DBFilter<T extends FieldValues> {
    type: GroupType,
    filters: ColumnFilter<T>[]
}

function groupQueryResolver<T extends FieldValues>(q: ExpressionBuilder<DB, "projects">, filters: ColumnFilter<T>[]) {
    const ret = [];
    for (const filter of filters) {
        if (filter.type == FilterCheckType.IN_RANGE) {
            ret.push(q(filter.column, 'in', filter.value));
        } else {
            ret.push(q(filter.column, filter.type, filter.value));
        }
    }
    return ret;
}

function queryCombiner<T extends FieldValues>(q: ExpressionBuilder<DB, "projects">, dbFilter: DBFilter<T>) {
    const {type, filters} = dbFilter;
    const groupExpressions = groupQueryResolver(q, filters);
    if (type == 'and') {
        return q.and(groupExpressions);
    } else {
        return q.or(groupExpressions);
    }
}

let testFilter: DBFilter<Project> = {
    type: GroupType.AND,
    filters: [
        {column: 'createdBy', type: '=', value: 'Admin'}
    ]
}

export async function getProjects(dbFilter: DBFilter<Project>) {
    let query = db.selectFrom('projects');
    query = query.where(q => queryCombiner(q, dbFilter));
    return await query.execute();
}

