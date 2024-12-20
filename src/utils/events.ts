import { Interaction, TextChannel } from "discord.js"
import { INode, Player, Track, TTrackEndType } from "moonlink.js"

import { bot } from "../main.js"
import { trackMessage } from "./message.js"

export function handleEvents() {
  bot.moonlink.on("nodeCreate", (node: INode) => {
    console.log(`Connected to ${node.host}:${node.port}`)
  })

  bot.moonlink.on("trackStart", async (player: Player, track: Track) => {
    console.log(
      `trackStart: ${track.title} by ${track.author} in ${player.guildId}`
    )

    try {
      const channel = bot.channels.cache.get(
        player.textChannelId
      ) as TextChannel
      if (channel)
        await channel.send(trackMessage(":play_pause: Now Playing", track))
    } catch (error) {
      console.error(`Error in 'trackStart': ${error}`)
    }
  })

  bot.moonlink.on(
    "trackEnd",
    async (
      player: Player,
      track: Track,
      type: TTrackEndType,
      payload?: any
    ) => {
      console.log(
        `trackEnd: ${track.title} by ${track.author} in ${player.guildId}`
      )

      try {
        if (
          player.queue.size == 0 &&
          player.autoPlay &&
          !track.url?.startsWith("https://www.youtube.com/")
        ) {
          player.destroy()

          const channel = bot.channels.cache.get(
            player.textChannelId
          ) as TextChannel
          if (channel)
            await channel.send(
              ":x: Auto-Play was enabled and a Non-YouTube track has ended with no other tracks left in queue. Auto-Play only works with YouTube tracks. Spotify and SoundCloud support will be added later!"
            )
        }
      } catch (error) {
        console.error(`Error in 'trackEnd': ${error}`)
      }
    }
  )

  bot.moonlink.on(
    "trackStuck",
    (player: Player, track: Track, threshold: number) =>
      console.log(
        `trackStuck: ${track.title} by ${track.author} in ${player.guildId}`
      )
  )

  bot.moonlink.on(
    "trackException",
    (player: Player, track: Track, exception: any) =>
      console.log(
        `trackException: ${track.title} by ${track.author} (${exception.message}) in ${player.guildId}`
      )
  )

  bot.once("ready", async () => {
    await bot.moonlink.init(bot.user!.id)
    await bot.initApplicationCommands()

    console.log(`Logged in as ${bot.user!.username} (${bot.user!.id})`)
  })

  bot.on("raw", (data) => bot.moonlink.packetUpdate(data))

  bot.on("interactionCreate", (interaction: Interaction) =>
    bot.executeInteraction(interaction)
  )
}
