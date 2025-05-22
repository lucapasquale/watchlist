const regex = /(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/;

export function parseDuration(duration: string): number {
  const matches = duration.toLowerCase().match(regex);
  if (!matches?.[0]) {
    throw new Error(`Invalid duration format: ${duration}`);
  }

  const hours = parseInt(matches[1] || "0");
  const minutes = parseInt(matches[2] || "0");
  const seconds = parseInt(matches[3] || "0");

  return hours * 3600 + minutes * 60 + seconds;
}

export function timeToDuration(time: number): string {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = Math.floor(time % 60);

  let duration = "";

  if (hours > 0) {
    duration += `${hours}:`;
  }

  const minutePaddingLength = hours > 0 ? 2 : 1;
  duration += `${minutes.toString().padStart(minutePaddingLength, "0")}:`;
  duration += `${seconds.toString().padStart(2, "0")}`;

  return duration;
}
