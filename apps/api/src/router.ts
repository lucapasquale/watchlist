import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import { createPlaylist, getPlaylist, updatePlaylist } from "./procedures/playlist.js";
import { createVideo, getPlaylistVideos, getVideo, updateVideo } from "./procedures/video.js";
import { router } from "./trpc.js";

export const appRouter = router({
  getPlaylist,
  createPlaylist,
  updatePlaylist,

  getPlaylistVideos,
  getVideo,
  createVideo,
  updateVideo,
});

export type AppRouter = typeof appRouter;

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
