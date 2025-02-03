import error from "../utils/error";
import post from "../functions/post";
import CommandType from "../types/command";
import { readdirSync } from "fs";
import TelegramClient from "../classes/Client";

export default async (client: TelegramClient) => {
    try {
        let
            amount = 0,
            dirname=`${process.cwd()}/dist/src/triggers`,
            triggers = readdirSync(dirname).filter(file => file.endsWith(".js"));

        for (const file of triggers) {
            const triggerFile = await import(`${dirname}/${file}`);
            const trigger = triggerFile.default || triggerFile;
            await trigger(client);
            amount++;
        }
        post((String(amount)).cyan + " Trigger Is Loaded!!".green, "S");
    } catch (e: any) {
        error(e)
    }
};
/**
 * @copyright
 * Coded by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * @copyright
 * Work for Persian Caesar | https://dsc.gg/persian-caesar
 * @copyright
 * Please Mention Us "Persian Caesar", When Have Problem With Using This Code!
 * @copyright
 */