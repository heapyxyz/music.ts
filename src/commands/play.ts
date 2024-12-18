import { ApplicationCommandOptionType, CommandInteraction } from "discord.js"
import { Discord, Slash, SlashOption } from "discordx"

import { bot } from "../main.js"
import { playlistMessage, trackMessage } from "../utils/message.js"

@Discord()
export class Play {
  @Slash({
    description: "Adds song(s) to queue using query.",
    name: "play",
  })
  async play(
    @SlashOption({
      description: "Query used in searching for tracks.",
      name: "query",
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    query: string,
    @SlashOption({
      description: "Enable or disable Auto-Play?",
      name: "auto-play",
      required: false,
      type: ApplicationCommandOptionType.Boolean,
    })
    autoPlay: boolean = false,
    interaction: CommandInteraction
  ): Promise<void> {
    // Interaction or its needed property is undefined :thinking:
    if (!interaction || !interaction.guildId || !interaction.member) return

    const guild = bot.guilds.cache.get(interaction.guildId)
    if (!guild) return // Guild doesn't exist, but why and how?

    const member = guild.members.cache.get(interaction.member.user.id)
    if (!member) return // Member doesn't exist, but why and how?

    const voiceChannel = member.voice.channel
    if (!voiceChannel) {
      await interaction.reply({
        content: `:x: Join a voice channel first.`,
        ephemeral: true,
      })

      return
    }

    try {
      const player = bot.moonlink.createPlayer({
        guildId: interaction.guildId,
        voiceChannelId: voiceChannel.id,
        textChannelId: interaction.channelId,
        autoPlay: autoPlay,
      })

      if (!player.connected) {
        player.connect({
          setDeaf: true,
          setMute: false,
        })
      } else if (player.voiceChannelId != member.voice.channelId) {
        await interaction.reply({
          content: `:x: You are not in the same voice channel as bot.`,
          ephemeral: true,
        })

        return
      }

      const results = await bot.moonlink.search({
        query,
        source: "youtube",
        requester: interaction.user.id,
      })

      if (results.loadType == "loadfailed") {
        await interaction.reply({
          content: `:x: Failed to load the track.`,
          ephemeral: true,
        })

        return
      } else if (results.loadType == "empty") {
        await interaction.reply({
          content: `:x: No results.`,
          ephemeral: true,
        })

        return
      }

      if (results.loadType == "playlist") {
        const message = await interaction.reply(
          playlistMessage(
            ":arrows_counterclockwise: Adding Playlist to Queue...",
            results.playlistInfo,
            query
          )
        )

        for (const track of results.tracks) player.queue.add(track)

        await message.edit(
          playlistMessage(
            ":white_check_mark: Added Playlist to Queue!",
            results.playlistInfo,
            query
          )
        )
      } else {
        player.queue.add(results.tracks[0])

        await interaction.reply(
          trackMessage(
            ":white_check_mark: Added Track to Queue",
            results.tracks[0]
          )
        )
      }

      if (!player.playing) await player.play()
    } catch (error) {
      console.error(`Error in /play: ${error}`)
    }
  }
}
