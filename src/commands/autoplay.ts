import { ApplicationCommandOptionType, CommandInteraction } from "discord.js"
import { Discord, Slash, SlashOption } from "discordx"

import { bot } from "../main.js"

@Discord()
export class Play {
  @Slash({
    description: "Enables or disabled Auto-Play.",
    name: "autoplay",
  })
  async play(
    @SlashOption({
      description: "Enable Auto-Play?",
      name: "enabled",
      required: true,
      type: ApplicationCommandOptionType.Boolean,
    })
    autoPlay: boolean,
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
        content: `:x: Join a voice channel first!`,
        ephemeral: true,
      })

      return
    }

    try {
      const player = bot.moonlink.getPlayer(interaction.guildId)

      if (!player.connected) {
        await interaction.reply({
          content: `:x: Bot is not connected to a voice channel.`,
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

      player.setAutoPlay(autoPlay)
    } catch (error) {
      console.error(`Error in /autoplay: ${error}`)
    }
  }
}
