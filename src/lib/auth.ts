import { betterAuth } from "better-auth";
import { MysqlDialect } from "kysely";
import { createPool } from "mysql2";


const dialect = new MysqlDialect({
  pool: createPool({
    database: "devdepot",
    host: "localhost"
  })
})

export const auth = betterAuth({
    database: {
      dialect,
      type: "mysql"
    }
})