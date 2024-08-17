import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  loader: () => {
    throw redirect({
      to: "/lists/$listID",
      params: { listID: "PL2gDVp_0vZOQjqMex201dYpUiu1mcGX96" },
    });
  },
});
