# Introduction
Music.ts is a Discord music bot made in TypeScript with Moonlink.js and DiscordX.  
Bot supports YouTube, Spotify and SoundCloud, but **it doesn't mean other sources won't work!**  
Sources like Twitch, Deezer or Bandcamp will (most likely) work fine - I just never tested them.

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