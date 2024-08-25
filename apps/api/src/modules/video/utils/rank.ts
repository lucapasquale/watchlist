import { LexoRank } from "lexorank";

import type { Video } from "../schema";

export function getNextRank(video: Video | undefined) {
  if (!video) {
    return LexoRank.middle();
  }

  return LexoRank.parse(video.rank).genNext();
}

export function getRankBetween([beforeVideo, afterVideo]: [Video | undefined, Video | undefined]) {
  if (beforeVideo && afterVideo) {
    return LexoRank.parse(beforeVideo.rank).between(LexoRank.parse(afterVideo.rank));
  }

  if (beforeVideo) {
    return LexoRank.parse(beforeVideo.rank).genNext();
  }

  if (afterVideo) {
    return LexoRank.parse(afterVideo.rank).genPrev();
  }

  return LexoRank.middle();
}
