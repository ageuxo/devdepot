import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "http://193.181.29.62:3000/"
})