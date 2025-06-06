import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { MysqlDialect } from "kysely";
import { createPool } from "mysql2";


const dialect = new MysqlDialect({
  pool: createPool({
    database: "devdepot",
    host: "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASS
  })
})

export const auth = betterAuth({
    database: {
      dialect,
      type: "mysql"
    },
    emailAndPassword: {
      enabled: true
    },
    plugins: [nextCookies()]
})