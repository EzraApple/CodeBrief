import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "~/server/db";
import {env} from "~/env";

export const auth = betterAuth({
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        github: {
            clientId: env.GITHUB_CLIENT_ID as string,
            clientSecret: env.GITHUB_CLIENT_SECRET as string,
            scope: ["repo"],
        },
    },
    database: prismaAdapter(db, {
        provider: 'sqlite'
    }),
});