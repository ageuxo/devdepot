import NewProjectForm from "./newProject";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "../api/projects/route";
import { Project } from "kysely-codegen";
import { Insertable } from "kysely";

export default function NewProjectPage() {
    return (
        <div>
            < NewProjectForm />
        </div>
    )
}

async function createProject(project: Insertable<Project>) {
    'use server';
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

    const createProjectQuery = db
        .insertInto("projects")
        .values({
            createdBy: session.user.id,
            name: project.name,
            description: project.description
        })

    return (
        <div>

        </div>
    );
}