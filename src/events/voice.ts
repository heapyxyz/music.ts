import { ArgsOf, Discord, On } from "discordx"

import { bot } from "../main.js"

@Discord()
export class Voice {
  @On({ event: "voiceStateUpdate" })
  voiceStateUpdate([oldState, newState]: ArgsOf<"voiceStateUpdate">): void {
    const player = bot.moonlink.getPlayer(oldState.guild.id)

    if (!player || !oldState.channel) return

    if (
      player.voiceChannelId == oldState.channelId &&
      oldState.channelId != newState.channelId &&
      oldState.channel.members.size == 1
    )
      player.destroy()
  }
}
