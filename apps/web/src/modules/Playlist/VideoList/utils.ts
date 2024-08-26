import { DropResult } from "@hello-pangea/dnd";

import { RouterOutput } from "~utils/trpc";

export function getMoveInput(
  videos: NonNullable<RouterOutput["getPlaylistVideos"]>,
  result: DropResult,
) {
  if (!result.destination || result.source.index === result.destination.index) {
    return null;
  }

  const video = videos[result.source.index];
  if (result.destination.index === 0) {
    return { id: video.id, videoBeforeID: null };
  }

  const moveOffset = result.source.index > result.destination.index ? -1 : 0;
  const videoBefore = videos[result.destination.index + moveOffset];

  return { id: video.id, videoBeforeID: videoBefore.id };
}

export function reorderList<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}