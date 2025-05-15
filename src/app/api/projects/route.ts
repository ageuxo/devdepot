import { Generated, Kysely, MysqlDialect } from "kysely";
import { createPool } from "mysql2";
import { DB } from "kysely-codegen";

export const db = new Kysely<DB>({
    dialect: new MysqlDialect({
        pool: createPool({
            database: 'devdepot',
            user: process.env.DB_USER,
            password: process.env.DB_PASS
        })
    })
});

const projectQuery = db
    .selectFrom('projects')
    .selectAll()
    .compile();

export async function getProjects() {
    return await db.executeQuery(projectQuery);
}

