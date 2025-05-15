import { db } from "./route";

// Database schemas
// Currently unused

const projectSchema = db.schema
    .createTable('projects').ifNotExists()
    .addColumn('id', 'integer', (col) => col.autoIncrement().primaryKey())
    .addColumn('name', 'varchar(255)', (col) => col.notNull())
    .addColumn('createdAt', 'datetime', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn('createdBy', 'integer')
        .addForeignKeyConstraint('projects_user_id_foreign', ["createdBy"], 'user', ['id'], (cb) => cb.onDelete('cascade'))
    .addColumn('description', 'text')
    .compile();

const tagSchema = db.schema
    .createTable('tags').ifNotExists()
    .addColumn('id', 'integer', (col) => col.autoIncrement().primaryKey())
    .addColumn('name', 'varchar(100)', (col) => col.notNull().unique())
    .addColumn('colour', 'varchar(7)')
    .addColumn('category', 'varchar(100)') // Replace with category table reference?
    .compile();

const categorySchema = db.schema
    .createTable('categories').ifNotExists()
    .addColumn('id', 'integer', (col) => col.autoIncrement().primaryKey())
    .addColumn('name', 'varchar(100)', (col) => col.notNull().unique())
    .compile();

const projectTagsSchema = db.schema
    .createTable('projectTags').ifNotExists()
    .addColumn('projectId', 'integer', (col) => col.notNull())
        .addForeignKeyConstraint('projectTags_foreign_projectId', ['projectId'], 'projects', ['id'], (cb) => cb.onDelete('cascade'))
    .addColumn('tagId', 'integer', (col) => col.notNull())
        .addForeignKeyConstraint('projectTags_foreign_tagId', ['tagId'], 'tags', ['id'], (cb) => cb.onDelete('cascade'))
    .addPrimaryKeyConstraint('projectTags_primary', ['projectId', 'tagId'])
    .compile();