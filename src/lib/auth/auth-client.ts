import { createAuthClient } from "better-auth/react"
import { env } from "~/env";

export const { signIn, signOut, signUp, useSession } = createAuthClient({
    baseURL: env.NEXT_PUBLIC_BETTER_AUTH_URL
})
