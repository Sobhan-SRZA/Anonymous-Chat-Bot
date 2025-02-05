import { MyContext } from "./MessageContext";
import TelegramClient from "../classes/Client";
import { NarrowedContext } from "telegraf";
import { Message, Update } from "telegraf/typings/core/types/typegram";

type Categories = "misc" | "admin" | "owner" | "chats";

export default interface CommandType {
    data: {
        name: string;
        description: string;
    };
    category: Categories;
    aliases?: string[];
    usage?: string;
    cooldown: number;
    only_owner?: boolean;
    only_group?: boolean;
    only_admins?: boolean;
    only_privet?: boolean;
    run: (client: TelegramClient, ctx: NarrowedContext<MyContext, Update.MessageUpdate<Message>>, args: string[]) => Promise<any>;
}

export type {
    Categories
}
/**
 * @copyright
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */