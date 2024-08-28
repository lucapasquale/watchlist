import { LexoRank } from "lexorank";

import { PlaylistItem } from "../../playlist/models.js";

export function getRankBetween([beforeVideo, afterVideo]: [
  PlaylistItem | undefined,
  PlaylistItem | undefined,
]) {
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
