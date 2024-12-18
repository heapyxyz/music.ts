import { CommandInteraction } from "discord.js"
import { Discord, Slash } from "discordx"

import { startDate } from "../main.js"

@Discord()
export class Uptime {
  @Slash({
    description: "Shows for how long bot has been running.",
    name: "uptime",
  })
  async uptime(interaction: CommandInteraction): Promise<void> {
    // Interaction or its needed property is undefined :thinking:
    if (!interaction) return

    await interaction.reply({
      content: `Bot is up since <t:${Math.floor(startDate / 1000)}:R>.`,
      ephemeral: true,
    })
  }
}
