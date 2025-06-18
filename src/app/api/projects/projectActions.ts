'use server'

import { DBFilter, filterQueryResolver } from "@/lib/KyselyFilters"
import { db } from "./route"
import { sql } from "kysely"

export interface TagData {
    name: string,
    category: string,
    colour: string
}

const aggregates = ['tags.']

export async function getProjects(dbFilter: DBFilter) {
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
    
    query = filterQueryResolver(query, dbFilter, aggregates)
    return query.execute();
}

const tagQuery = db
    .selectFrom('tags')
    .selectAll();

export async function getAllTags() {
    return await tagQuery.execute();
}

const allAuthorsWithProjectsQuery = db
    .selectFrom('projects')
    .innerJoin('user', 'projects.createdBy', 'user.id')
    .select('user.name')
    .distinct()
    .compile();

/**
 *     Get the names of all authors with published projects.
 */
export async function getAllProjectsAuthorNames() {
    return db.executeQuery(allAuthorsWithProjectsQuery);
}
