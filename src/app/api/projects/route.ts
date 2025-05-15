import { Generated, Kysely, MysqlDialect } from "kysely";
import { createPool } from "mysql2";

interface ProjectDatabase {
    projects: {
        id: Generated<Number>,
        name: string,
        createdAt: Date,
        createdBy: number,
        description: string,
    },
    user: {
        id: Generated<Number>,
        name: string,
        email: string,
        createdAt: Date,
        updatedAt: Date,
    }
}

export const db = new Kysely<ProjectDatabase>({
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

