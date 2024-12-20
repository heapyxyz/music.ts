import { ApplicationCommandOptionType, CommandInteraction } from "discord.js"
import { Discord, Slash, SlashChoice, SlashOption } from "discordx"

import { bot } from "../main.js"
import { TPlayerLoop } from "moonlink.js"

@Discord()
export class Loop {
  @Slash({
    description: "Manages loop.",
    name: "loop",
  })
  async loop(
    @SlashChoice({ name: "Disabled", value: "off" })
    @SlashChoice({ name: "Enabled (track)", value: "track" })
    @SlashChoice({ name: "Enabled (queue)", value: "queue" })
    @SlashOption({
      description: "Choose an option.",
      name: "option",
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    option: string,
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
      const player = bot.moonlink.getPlayer(interaction.guildId)

      if (player == undefined || !player.connected) {
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

      player.setLoop(<TPlayerLoop>option)

      await interaction.reply({
        content: `:white_check_mark: ${option == "track" ? "Enabled (track)" : option == "queue" ? "Enabled (queue)" : "Disabled"} loop.`,
        ephemeral: true,
      })
    } catch (error) {
      console.error(`Error in /loop: ${error}`)
    }
  }
}
