'use server';

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { db } from "../api/projects/route";

export async function createProject({name, description}: {name: string, description: string}) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        return (
            <div>
                You need to be logged in to perform this action!
            </div>
        );
    }

    const createProjectQuery = await db
        .insertInto("projects")
        .values({
            createdBy: session.user.id,
            name: name,
            description: description
        })
        .executeTakeFirst();

    return (
        <div>
            { createProjectQuery &&
                <p> Successfully created new project: <Link href={"/project/"+createProjectQuery.insertId }>{name}</Link> </p>
            }
        </div>
    );
}