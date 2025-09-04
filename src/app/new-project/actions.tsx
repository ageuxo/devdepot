'use server';

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "../api/projects/route";

export type NewProjectResult = 
        { status: 'success', id: number, name: string }
    |   { status: 'error', msg: string };

export async function createProject({name, description, tags}: {name: string, description: string, tags: { id: number, name: string, category: string, colour: string }[]}) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        return { status: 'error', msg: 'You need to be logged in to perform this action!' } as NewProjectResult;

    }

    let result: NewProjectResult = { status: 'error', msg: 'An error has ocurred, please try again later' };
    try {
        const transaction = await db.transaction().execute(async (trx) => {
            const newProject = await trx.insertInto("projects")
                .values({
                    createdBy: session.user.id,
                    name: name,
                    description: description
                })
                .executeTakeFirstOrThrow();

            // WARNING this might have hard to track down consequences, but it should be fine.... IDs should realistically never go above Number's max int limit
            const projectId = Number(newProject.insertId)

            if (projectId == undefined) {
                throw new Error('New project returned undefined id!');
            } else {
                const foundTags = tags.map(t => {
                    return { projectId: projectId, tagId: t.id };
                });

                const tagQuery = await trx.insertInto("projectTags")
                    .values(foundTags)
                    .returningAll()
                    .executeTakeFirstOrThrow();
            }

            return projectId;
        });

        result = { status: 'success', id: transaction, name: name };
    } catch (error) {
        console.log(error);
        result = { status: 'error', msg: error instanceof Error ? error.message : 'An unknown error has ocurred, please try again later' };
    } finally {
        return result;
    }
    
}