import { IPlaylistInfo, Track } from "moonlink.js"

export function trackMessage(title: string, track: Track): string {
  return `## ${title}\n[**${track.title.replaceAll(/\[|\]/g, "")}**](<${track.url}>)\n-# By **${track.author}** | Duration: **${track.duration}**`
}

export function playlistMessage(
  title: string,
  playlist: IPlaylistInfo,
  url: string
): string {
  return `## ${title}\n[**${playlist.name.replaceAll(/\[|\]/g, "")}**](<${url}>)\n-# Duration: **${playlist.duration}**`
}
