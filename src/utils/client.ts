import { Client, ClientOptions } from "discordx"
import { Manager } from "moonlink.js"

export class MusicClient extends Client {
  moonlink: Manager

  constructor(options: ClientOptions, moonlink: Manager) {
    super(options)
    this.moonlink = moonlink
  }
}
