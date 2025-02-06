import { readdirSync } from "fs";
import TelegramClient from "../classes/Client";
import CommandType from "../types/command";
import error from "../utils/error";
import post from "../functions/post";

export default async (client: TelegramClient) => {
    try {
        await loadCommand(`${process.cwd()}/dist/src/commands`, client);
        post(`${client.commands.size}`.cyan + " Commands Is Loaded!!".green, "S");
    } catch (e: any) {
        error(e)
    }
};

// Function
async function loadCommand(dirname: string, client: TelegramClient) {
    try {
        for (const dirs of readdirSync(dirname)) {
            const commandFiles = readdirSync(`${dirname}/${dirs}`)
                .filter(files => files.endsWith(".js"));

            for (const file of commandFiles) {
                const commandData = await import(`${dirname}/${dirs}/${file}`);
                const command: CommandType = commandData.default || commandData;
                client.commands.set(command.data.name, command);
            }

        };

    } catch (e: any) {
        error(e)
    }
}
/**
 * @copyright
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */