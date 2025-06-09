'use server'

import { auth } from "@/lib/auth";
import { db } from "../api/projects/route";
import { headers } from "next/headers";
import * as fs from 'node:fs';

export interface ActionResult<T> {
    type: 'success' | 'failure' ,
    result?: T,
    msg?: string
}

export interface IUserContent {
    path: string,
    id: number,
    createdAt: Date,
    type: string,
    uploader: string,
    name: string,
    description: string
}

export async function getUserContent(): Promise<ActionResult<IUserContent[]>> {

    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        return failureResult('You need to be logged in to manage your content!');
    }

    const result = await db.selectFrom('userContent')
        .selectAll()
            .where('uploader', '=', session.user.id)
        .execute();

    if (result.length > 0) {
        return {
            type: "success",
            result
        }
    }

    return failureResult('No content');

}

function getContentType(file: File) {
    switch (file.type) {
        case 'image/png':
        case 'image/jpg':
        case 'image/jpeg':
            return 'image'
        default:
            return 'download';
    }
}

export async function uploadUserContent(content: File, name: string, description: string, type?: string) {
    if (!type ||
        ( type != 'image' && type != 'download' )) {
        type = getContentType(content);
    }

    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) {
        return failureResult('You need to be logged in to perform this action!');
    }

    const time = Date.now();
    const dirPath = `/userContent/${session.user.id}/`;
    const fileName = `${time}${content.name.match(/\.\w+$/i)}`

    // Make a transaction so we can rollback the insert if there's a problem.
    const trx = await db.startTransaction().execute();

    try {
        await trx
            .insertInto('userContent')
            .values({
                path: dirPath+fileName,
                type,
                uploader: session.user.id,
                name,
                description
            })
            .executeTakeFirst();

        await trx.commit().execute();
        const fsPath = `./public${dirPath}`;

        fs.mkdir(fsPath, { recursive: true }, (err) => {
            if (err) throw err; // Throw any errors
        })
        fs.writeFile(`${fsPath}${fileName}`, await content.bytes(), (err) => {
            if (err) throw err; // Throw any errors
        } );

    } catch (err) {
        await trx.rollback().execute();
        console.error('Error creating userContent file for user "%s"(id: %s). ', session.user.name, session.user.id, err);
    }
}

function failureResult<T>(msg: string): ActionResult<T> {
    return {
        type: 'failure',
        msg,
    }
}