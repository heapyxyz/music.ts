export function formatDuration(duration: number): string {
  var str = ""
  const inSeconds = duration / 1000

  const hours = Math.floor(inSeconds / 1000 / 60 ** 2)
  if (hours > 0) str += `${hours} hours `
  const minutes = Math.floor((inSeconds - hours * 60 ** 2) / 60)
  if (minutes > 0) str += `${minutes} minutes `
  const seconds = duration % (minutes * 60)
  if (seconds > 0) str += `${seconds} seconds `

  return minutes > 0 && seconds > 0
    ? `${minutes} minutes, ${seconds} seconds`
    : minutes > 0 && seconds == 0
      ? `${minutes} minutes`
      : minutes == 0 && seconds > 0
        ? `${seconds} seconds`
        : "Unknown"
}
