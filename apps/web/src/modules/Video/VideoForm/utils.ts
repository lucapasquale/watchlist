import { DropResult } from "@hello-pangea/dnd";

import { FormValues } from ".";

export function getMoveInput(values: FormValues, result: DropResult) {
  const video = values.videos[result.source.index];

  // TODO: fix ID issue
  if (!video?.id || !result.destination || result.source.index === result.destination.index) {
    return null;
  }

  if (result.destination.index === 0) {
    return { id: video.id, videoBeforeID: null };
  }

  const moveOffset = result.source.index > result.destination.index ? -1 : 0;
  const videoBefore = values.videos[result.destination.index + moveOffset];
  if (!videoBefore?.id) {
    return null;
  }

  return { id: video.id, videoBeforeID: videoBefore.id };
}
