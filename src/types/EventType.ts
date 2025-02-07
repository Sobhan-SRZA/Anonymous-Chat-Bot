import { UpdateType } from "telegraf/typings/telegram-types";
import TelegramClient from "../classes/Client";

export default interface EventType {
 name: UpdateType | Function;
 run: (client: TelegramClient, ...args: any) => Promise<any>;
}
/**
 * @copyright
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */