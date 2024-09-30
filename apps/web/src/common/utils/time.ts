export function formatDuration(durationSeconds: number) {
  const hours = Math.floor(durationSeconds / (60 * 60));
  const minutes = Math.floor(durationSeconds / 60) % 60;
  const seconds = durationSeconds % 60;

  if (hours > 0) {
    return [hours, String(minutes).padStart(2, "0"), String(seconds).padStart(2, "0")].join(":");
  }

  return [minutes, String(seconds).padStart(2, "0")].join(":");
}
