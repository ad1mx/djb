# DJB - DiscordJS Bot Library

**DJB** is a powerful and intuitive library that simplifies Discord bot development using [Discord.js](https://discord.js.org). It offers a structured approach to managing events, commands, and client configurations, making bot development easier and more organized.

---

## Features

- Easy-to-use `DJBClient` class for streamlined bot initialization.
- Clean file structure for commands and events.
- Built-in support for MongoDB (optional).
- Advanced command and event handling with type safety.
- Fully compatible with the latest version of Discord.js.

---

## Installation

Install DJB using npm:

```bash
npm install @ad1m/djb
```

---

## File Structure

DJB follows a structured approach to organizing commands and events.

### Events

- Events are located in the `app/events` directory.
- Each event file exports a `config` object and an `execute` function.

**Example Event File**: `app/events/client-ready.ts`

```typescript
import { log } from "@ad1m/logger";
import { EventConfig, EventExecute } from "@ad1m/djb";
import { Events } from "discord.js";

export const config: EventConfig = {
  name: Events.ClientReady,
  once: true,
};

const ClientReady: EventExecute<typeof Events.ClientReady> = async (client) => {
  log.success("client", `Client is ready  @${client.user?.tag}`);
};

export default ClientReady;
```

### Commands

- Commands are located in the `app/commands` directory.
- Each command file exports a `config` object and a default `execute` function.
  c
  **Example Command File**: `app/commands/ping.ts`

```typescript
import { CommandConfig, CommandExecute } from "@ad1m/djb";

export const config: CommandConfig = {
  description: "Pings the bot",
};

const Ping: CommandExecute = (client, message) => {
  message.reply("Pong 🏓!");
};

export default Ping;
```

---

## Usage

### Basic Setup

Here is an example of how to set up a bot using DJB:

**Index File**: `index.ts`

```typescript
import { GatewayIntentBits, Partials } from "discord.js";
import { DJBClient } from "@ad1m/djb";

const djbClient = new DJBClient(
  {
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.Channel],
  },
  { mongoDb: true }
);

djbClient.start();
```

---

## Contributions

Contributions are welcome! Feel free to submit issues or pull requests to improve DJB.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

### Links

- [GitHub Repository](https://github.com/ad1mx/djb)
- [NPM Package](https://www.npmjs.com/package/@ad1m/djb)
