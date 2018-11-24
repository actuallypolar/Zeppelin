import path from "path";
import yaml from "js-yaml";

import _fs from "fs";
const fs = _fs.promises;

require("dotenv").config();

process.on("unhandledRejection", (reason, p) => {
  // tslint:disable-next-line
  console.error(reason);
  process.exit(1);
});

process.on("uncaughtException", err => {
  if (err.message && err.message.startsWith("DiscordHTTPError")) {
    console.error(err);
    return;
  } else {
    console.error(err);
    process.exit(1);
  }
});

// Always use UTC
import moment from "moment-timezone";
moment.tz.setDefault("UTC");

import { Client } from "eris";
import { Knub, logger } from "knub";
import { connect } from "./data/db";

// Global plugins
import { BotControlPlugin } from "./plugins/BotControl";
import { LogServerPlugin } from "./plugins/LogServer";

// Guild plugins
import { ModActionsPlugin } from "./plugins/ModActions";
import { UtilityPlugin } from "./plugins/Utility";
import { LogsPlugin } from "./plugins/Logs";
import { PostPlugin } from "./plugins/Post";
import { ReactionRolesPlugin } from "./plugins/ReactionRoles";
import { CensorPlugin } from "./plugins/Censor";
import { PersistPlugin } from "./plugins/Persist";
import { SpamPlugin } from "./plugins/Spam";
import { TagsPlugin } from "./plugins/Tags";
import { MessageSaverPlugin } from "./plugins/MessageSaver";

// Run latest database migrations
logger.info("Running database migrations");
connect().then(async conn => {
  await conn.runMigrations();

  const client = new Client(process.env.TOKEN, {
    getAllUsers: true
  });
  client.setMaxListeners(100);

  const bot = new Knub(client, {
    plugins: {
      messageSaver: MessageSaverPlugin,

      utility: UtilityPlugin,
      mod_actions: ModActionsPlugin,
      logs: LogsPlugin,
      post: PostPlugin,
      reaction_roles: ReactionRolesPlugin,
      censor: CensorPlugin,
      persist: PersistPlugin,
      spam: SpamPlugin,
      tags: TagsPlugin
    },
    globalPlugins: {
      bot_control: BotControlPlugin,
      log_server: LogServerPlugin
    },

    options: {
      getEnabledPlugins(guildId, guildConfig): string[] {
        const plugins = guildConfig.plugins || {};
        const keys: string[] = Array.from(this.plugins.keys());
        return keys.filter(pluginName => {
          return (plugins[pluginName] && plugins[pluginName].enabled !== false) || pluginName === "messageSaver";
        });
      },

      async getConfig(id) {
        const configFile = id ? `${id}.yml` : "global.yml";
        const configPath = path.join("config", configFile);

        try {
          await fs.access(configPath);
        } catch (e) {
          return {};
        }

        const yamlString = await fs.readFile(configPath, { encoding: "utf8" });
        return yaml.safeLoad(yamlString);
      },

      logFn: (level, msg) => {
        if (level === "debug") return;
        console.log(`[${level.toUpperCase()}] ${msg}`);
      }
    }
  });

  logger.info("Starting the bot");
  bot.run();
});
