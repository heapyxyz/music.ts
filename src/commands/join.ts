import { ApplicationCommandOptionType, CommandInteraction } from "discord.js"
import { Discord, Slash, SlashOption } from "discordx"

import { bot } from "../main.js"

@Discord()
export class Join {
  @Slash({
    description: "Joins a voice channel.",
    name: "join",
  })
  async join(
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
        autoLeave: true,
      })

      if (player.connected) {
        await interaction.reply({
          content: `:x: Bot is already connected to a voice channel.`,
          ephemeral: true,
        })

        return
      } else if (player.voiceChannelId != member.voice.channelId) {
        await interaction.reply({
          content: `:x: You are not in the same voice channel as bot.`,
          ephemeral: true,
        })

        return
      }

      player.connect({
        setDeaf: true,
        setMute: false,
      })
      await interaction.reply(`## :arrow_right: Joined a Voice Channel`)
    } catch (error) {
      console.error(`Error in /join: ${error}`)
    }
  }
}
