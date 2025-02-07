/**
 * @license
  BSD 3-Clause License

  Copyright (c) 2024, the respective contributors, as shown by Persian Caesar and Sobhan.SRZA (mr.sinre) file.

  All rights reserved.

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

  * Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

  * Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
  DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
  FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
  DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
  SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
  CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
  OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
  OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
// Add color to console messages.
import "colors";

// Support .env args
import * as dotenv from "dotenv";
dotenv.config();

// Load discord client
import { readdirSync } from "fs";
import TelegramClient from "./src/classes/Client";
import packageJSON from "./src/types/package.json";
import logger from "./src/functions/logger";
import error from "./src/utils/error";
import post from "./src/functions/post";
import os from "os";

const
    client = new TelegramClient(),
    handle = readdirSync(__dirname + "/src/handlers").filter(file => file.endsWith(".js"));

// Login 
const main = async () => {
    try {

        // Load Handlers 
        let amount = 0;
        const packageJSON: packageJSON = await import(`${process.cwd()}/package.json`);
        post(
            "Welcome to ".cyan + (packageJSON.name).blue + "! | Version: ".cyan + (packageJSON.version).blue + "\n" +
            "Coded By ".cyan + ("Sobhan-SRZA").yellow + " & ".cyan + ("Persian Caesar").yellow + " With ".cyan + ("❤️").red + "\n" +
            `Discord: ${("Mr.Sinre").blue}` + " | ".cyan + `${("mr.sinre").blue}` + " | ".cyan + `${("https://dsc.gg/persian-caesar").blue}` + "\n" +
            `GitHub: ${("https://github.com/Sobhan-SRZA").blue}` + " | ".cyan + `${("https://github.com/Persian-Caesar").blue}`,
            "W",
            "magenta",
            "cyan"
        );
        post("Logging into the BOT...", "S");
        for (const file of handle) {
            const handlerFile = await import(`./src/handlers/${file}`);
            const handler = handlerFile.default || handlerFile;
            await handler(client);
            amount++;
        }
        post((String(amount)).cyan + " Handler Is Loaded!!".green, "S");
        if (client.config.bot.token)
            await client
                .launch(async () => {
                    post(
                        "Telegram bot is online!".blue + `\n` +
                        "@" + client.botInfo!.username.cyan + " is now online :)".green,
                        "S"
                    );
                    logger(
                        "Commands: ".blue +
                        `${client.commands.size}`.cyan + `\n` +
                        "Telegraf.js: ".blue +
                        `v${packageJSON.dependencies.telegraf.replace("^", "")}`.cyan + `\n` +
                        "Node.js: ".blue +
                        `${process.version}`.cyan + `\n` +
                        "Plattform: ".blue +
                        `${process.platform} ${process.arch} | ${os.cpus().map((i) => `${i.model}`)[0]} | ${String(os.loadavg()[0])}%`.cyan + `\n` +
                        "Memory: ".blue +
                        `${Math.round(
                            +((os.totalmem() - os.freemem()) / 1024 / 1024).toFixed(2)
                        )
                            .toLocaleString()
                            }/${Math.round(
                                +((os.totalmem()) / 1024 / 1024).toFixed(2)
                            )
                                .toLocaleString()
                            } MB | ${(
                                (
                                    (os.totalmem() - os.freemem()) / os.totalmem()
                                ) * 100)
                                .toFixed(2)
                            }%`.cyan
                    );

                    // Upload commands to the button menu.
                    const commands = client.commands.map(
                        a => {
                            return {
                                command: a.data.name.slice(0, 31),
                                description: a.data.description.slice(0, 255)
                            }
                        }
                    );
                    await client.telegram.setMyCommands(
                        commands
                    )
                })
                .catch(e => {
                    post("Something when bot is loading went wrong!", "E", "red", "red");
                    error(e);
                });

        else
            post("Please write your bot token opposite the token in the config.js file (or .env file) in your project!!", "E", "red", "red");

    } catch (e: any) {
        error(e);
        client.stop();
        process.exit(1);
    }
};
void main();

// Load Anti Crash
if (client.config.source.anti_crash) {
    process.on("unhandledRejection", (e: any) => error(e));
    process.on("rejectionHandled", (e: any) => error(e));
    process.on("uncaughtException", (e: any) => error(e));
    process.on("uncaughtExceptionMonitor", (e: any) => error(e));
}

// Export client
export default client;
/**
 * @copyright
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */