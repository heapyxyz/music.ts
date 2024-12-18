import { dirname, importx } from "@discordx/importer"
import { IntentsBitField } from "discord.js"
import * as dotenv from "dotenv"
import { Manager } from "moonlink.js"

import { MusicClient } from "./utils/client.js"
import { handleEvents } from "./utils/events.js"

export const startDate = Date.now()
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

async function run() {
  dotenv.config()
  handleEvents()

  await importx(`${dirname(import.meta.url)}/{events,commands}/**/*.{ts,js}`)

  if (!process.env.BOT_TOKEN)
    throw Error("Could not find BOT_TOKEN in your environment")

  await bot.login(process.env.BOT_TOKEN)
}

void run()
