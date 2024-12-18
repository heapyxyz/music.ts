import { IPlaylistInfo, Track } from "moonlink.js"

export function trackMessage(title: string, track: Track): string {
  return `## ${title}\n[**${track.title}**](<${track.url}>)\n-# By **${track.author}** | Duration: **${track.duration}**`
}

export function playlistMessage(
  title: string,
  playlist: IPlaylistInfo,
  url: string
): string {
  return `## ${title}\n[**${playlist.name}**](<${url}>)\n-# Duration: **${playlist.duration}**`
}
