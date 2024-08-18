import type { AppRouter } from "@api/router";
import { createTRPCReact } from "@trpc/react-query";

export const trpc = createTRPCReact<AppRouter>();

export type { RouterInput, RouterOutput } from "@api/router";
