import { postRouter } from "~/server/api/routers/post";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import {githubRouter} from "~/server/api/routers/github";
import {reportRouter} from "~/server/api/routers/report";
import {llmRouter} from "~/server/api/routers/llm";
import {repoContextRouter} from "~/server/api/routers/context";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  github: githubRouter,
  report: reportRouter,
  context: repoContextRouter,
  llm: llmRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
