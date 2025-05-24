'use server'

import { DB, Project, Tag } from "kysely-codegen"
import { db } from "./route"
import { FieldName, FieldValues } from "react-hook-form"
import { ExpressionBuilder, Selectable, SelectQueryBuilder, sql } from "kysely"
import { jsonArrayFrom } from "kysely/helpers/mysql"

export interface TagData {
    name: string,
    category: string,
    colour: string
}

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
    OR: 'or',
    EMPTY: 'empty'
} as const;
type GroupType = typeof GroupType[keyof typeof GroupType];

export interface DBFilter<T extends FieldValues> {
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

export async function getProjects(dbFilter: DBFilter<Project>) {
    let query = db.selectFrom(['projects'])
    // join from user table when projects.createdBy = user.id
    .innerJoin('user', 'projects.createdBy', 'user.id')
    .leftJoin('projectTags', 'projects.id', 'projectTags.projectId')
    .leftJoin('tags', 'projectTags.tagId', 'tags.id')
    .selectAll('projects')
    .select([
        'user.name as createdByName',
    ])
    .select(sql<string>`JSON_ARRAYAGG(JSON_OBJECT("name", tags.name, "category", tags.category , "colour", tags.colour))`.as('tags'))
    

    if (dbFilter.type != GroupType.EMPTY) {
        query = query.where(q => queryCombiner(q, dbFilter));
    }
    return await query.execute();
}

const tagQuery = db
    .selectFrom('tags')
    .selectAll();

export async function getAllTags() {
    return await tagQuery.execute();
}

