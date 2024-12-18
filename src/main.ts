import { dirname, importx } from "@discordx/importer"
import { IntentsBitField, Interaction, TextChannel } from "discord.js"
import * as dotenv from "dotenv"
import { INode, Manager, Player, Track, TTrackEndType } from "moonlink.js"

import { MusicClient } from "./utils/client.js"
import { trackMessage } from "./utils/message.js"

export const bot = new MusicClient(
  {
    intents: [
      IntentsBitField.Flags.Guilds,
      IntentsBitField.Flags.GuildMembers,
      IntentsBitField.Flags.GuildMessages,
      IntentsBitField.Flags.GuildMessageReactions,
      IntentsBitField.Flags.GuildVoiceStates,
      IntentsBitField.Flags.MessageContent,
    ],
    silent: true,
  },
  new Manager({
    nodes: [
      {
        identifier: "main",
        host: "localhost",
        password: "youshallnotpass",
        port: 2333,
        secure: false,
      },
    ],
    options: { NodeLinkFeatures: true, previousInArray: true },
    sendPayload: (guildId: string, payload: string) => {
      const guild = bot.guilds.cache.get(guildId)
      if (guild) guild.shard.send(JSON.parse(payload))
    },
  })
)

bot.moonlink.on("nodeCreate", (node: INode) => {
  console.log(`Connected to ${node.host}:${node.port}`)
})

bot.moonlink.on("trackStart", async (player: Player, track: Track) => {
  console.log(
    `trackStart: ${track.title} by ${track.author} in ${player.guildId}`
  )

  try {
    const channel = bot.channels.cache.get(player.textChannelId) as TextChannel
    if (channel)
      await channel.send(trackMessage(":play_pause: Now Playing", track))
  } catch (error) {
    console.error(`Error in 'trackStart': ${error}`)
  }
})

bot.moonlink.on(
  "trackEnd",
  (player: Player, track: Track, type: TTrackEndType, payload?: any) =>
    console.log(
      `trackEnd: ${track.title} by ${track.author} in ${player.guildId}`
    )
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
      `trackException: ${track.title} by ${track.author} (${exception}) in ${player.guildId}`
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

async function run() {
  dotenv.config()
  await importx(`${dirname(import.meta.url)}/{events,commands}/**/*.{ts,js}`)

  if (!process.env.BOT_TOKEN)
    throw Error("Could not find BOT_TOKEN in your environment")

  await bot.login(process.env.BOT_TOKEN)
}

void run()
