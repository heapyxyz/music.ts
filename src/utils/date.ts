export function formatDuration(duration: number): string {
  const inSeconds = Math.floor(duration / 1000)

  const hours = Math.floor(inSeconds / (60 * 60))
  const minutes = Math.floor((inSeconds % (60 * 60)) / 60)
  const seconds = inSeconds % 60

  const parts: string[] = []

  if (hours > 0) parts.push(`${hours} ${hours === 1 ? "hour" : "hours"}`)
  if (minutes > 0)
    parts.push(`${minutes} ${minutes === 1 ? "minute" : "minutes"}`)
  if (seconds > 0)
    parts.push(`${seconds} ${seconds === 1 ? "second" : "seconds"}`)

  return parts.length > 0 ? parts.join(" ") : "0 seconds"
}
