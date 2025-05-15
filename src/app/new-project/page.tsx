import NewProjectForm from "./newProject";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "../api/projects/route";

export default function NewProjectPage() {
    return (
        <div>
            < NewProjectForm />
        </div>
    )
}

async function createProject({name, description}: {name: String, description: String}) {
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

/*     const createProjectQuery = db
        .insertInto("projects")
        .values({
            name,
            description,
            createdBy: session.user.id
        }) */

    return (
        <div>

        </div>
    );
}