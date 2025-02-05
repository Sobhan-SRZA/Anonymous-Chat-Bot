"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
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
require("colors");
// Support .env args
const dotenv = tslib_1.__importStar(require("dotenv"));
dotenv.config();
// Load discord client
const os_1 = tslib_1.__importDefault(require("os"));
const error_1 = tslib_1.__importDefault(require("./src/utils/error"));
const post_1 = tslib_1.__importDefault(require("./src/functions/post"));
const Client_1 = tslib_1.__importDefault(require("./src/classes/Client"));
const logger_1 = tslib_1.__importDefault(require("./src/functions/logger"));
const fs_1 = require("fs");
const client = new Client_1.default(), handle = (0, fs_1.readdirSync)(__dirname + "/src/handlers").filter(file => file.endsWith(".js"));
// Login 
const main = async () => {
    try {
        // Load Handlers 
        let amount = 0;
        const packageJSON = await Promise.resolve(`${`${process.cwd()}/package.json`}`).then(s => tslib_1.__importStar(require(s)));
        (0, post_1.default)("Welcome to ".cyan + (packageJSON.name).blue + "! | Version: ".cyan + (packageJSON.version).blue + "\n" +
            "Coded By ".cyan + ("Sobhan-SRZA").yellow + " & ".cyan + ("Persian Caesar").yellow + " With ".cyan + ("❤️").red + "\n" +
            `Discord: ${("Mr.Sinre").blue}` + " | ".cyan + `${("mr.sinre").blue}` + " | ".cyan + `${("https://dsc.gg/persian-caesar").blue}` + "\n" +
            `GitHub: ${("https://github.com/Sobhan-SRZA").blue}` + " | ".cyan + `${("https://github.com/Persian-Caesar").blue}`, "W", "magenta", "cyan");
        (0, post_1.default)("Logging into the BOT...", "S");
        for (const file of handle) {
            const handlerFile = await Promise.resolve(`${`./src/handlers/${file}`}`).then(s => tslib_1.__importStar(require(s)));
            const handler = handlerFile.default || handlerFile;
            await handler(client);
            amount++;
        }
        (0, post_1.default)((String(amount)).cyan + " Handler Is Loaded!!".green, "S");
        if (client.config.bot.token)
            await client
                .launch(async () => {
                (0, post_1.default)("Telegram bot is online!".blue + `\n` +
                    "@" + client.botInfo.username.cyan + " is now online :)".green, "S");
                (0, logger_1.default)("Commands: ".blue +
                    `${client.commands.size}`.cyan + `\n` +
                    "Telegraf.js: ".blue +
                    `v${packageJSON.dependencies.telegraf.replace("^", "")}`.cyan + `\n` +
                    "Node.js: ".blue +
                    `${process.version}`.cyan + `\n` +
                    "Plattform: ".blue +
                    `${process.platform} ${process.arch} | ${os_1.default.cpus().map((i) => `${i.model}`)[0]} | ${String(os_1.default.loadavg()[0])}%`.cyan + `\n` +
                    "Memory: ".blue +
                    `${Math.round(+((os_1.default.totalmem() - os_1.default.freemem()) / 1024 / 1024).toFixed(2))
                        .toLocaleString()}/${Math.round(+((os_1.default.totalmem()) / 1024 / 1024).toFixed(2))
                        .toLocaleString()} MB | ${(((os_1.default.totalmem() - os_1.default.freemem()) / os_1.default.totalmem()) * 100)
                        .toFixed(2)}%`.cyan);
                // Upload commands to the button menu.
                const commands = client.commands.map(a => {
                    return {
                        command: a.data.name.slice(0, 31),
                        description: a.data.description.slice(0, 255)
                    };
                });
                await client.telegram.setMyCommands(commands);
            })
                .catch(e => {
                (0, post_1.default)("Something when bot is loading went wrong!", "E", "red", "red");
                (0, error_1.default)(e);
            });
        else
            (0, post_1.default)("Please write your bot token opposite the token in the config.js file (or .env file) in your project!!", "E", "red", "red");
    }
    catch (e) {
        (0, error_1.default)(e);
        client.stop();
        process.exit(1);
    }
};
void main();
// Load Anti Crash
if (client.config.source.anti_crash) {
    process.on("unhandledRejection", (e) => (0, error_1.default)(e));
    process.on("rejectionHandled", (e) => (0, error_1.default)(e));
    process.on("uncaughtException", (e) => (0, error_1.default)(e));
    process.on("uncaughtExceptionMonitor", (e) => (0, error_1.default)(e));
}
// Export client
exports.default = client;
/**
 * @copyright
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */ 
//# sourceMappingURL=index.js.map