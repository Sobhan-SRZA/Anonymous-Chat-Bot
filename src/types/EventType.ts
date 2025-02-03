import { UpdateType } from "telegraf/typings/telegram-types";
import TelegramClient from "../classes/Client";

export default interface EventType {
 name: UpdateType;
 run: (client: TelegramClient, ...args: any) => Promise<void | any>;
}
/**
 * @copyright
 * Coded by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * @copyright
 * Work for Persian Caesar | https://dsc.gg/persian-caesar
 * @copyright
 * Please Mention Us Persian Caesar, When Have Problem With Using This Code!
 * @copyright
 */