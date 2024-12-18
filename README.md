# Introduction
Music.ts is a Discord music bot made in TypeScript with [Moonlink.js](https://github.com/Ecliptia/moonlink.js) and [DiscordX](https://github.com/discordx-ts/discordx).  
Bot supports YouTube, Spotify and SoundCloud, but **it doesn't mean other sources won't work!**  
Sources like Twitch, Deezer or Bandcamp will (most likely) work fine - I just never tested them.  
It is **highly** recommended to use [NodeLink](https://github.com/PerformanC/NodeLink) over [Lavalink](https://github.com/lavalink-devs/Lavalink) when hosting music.ts!

# Usage (Development)
**Rename `.env.example` to `.env` and configure it first!**
```
npm install
npm run dev
```

# Usage (Production)
**Rename `.env.example` to `.env` and configure it first!**
```
npm install --production
npm run build
npm run start
```

# Docker
### Starting
```
docker-compose up -d
```

### Stopping
```
docker-compose down
```

### Logs
```
docker-compose logs
```

[Full Docker command list can be viewed here.](https://docs.docker.com/engine/reference/commandline/cli/)