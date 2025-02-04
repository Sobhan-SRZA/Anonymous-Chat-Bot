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
    run: (client: TelegramClient, ctx: NarrowedContext<MyContext, Update.MessageUpdate<Message>>, args: string[]) => void;
}

export type {
    Categories
}
/**
 * @copyright
 * Coded by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * @copyright
 * Work for Persian Caesar | https://dsc.gg/persian-caesar
 * @copyright
 * Please Mention Us "Persian Caesar", When Have Problem With Using This Code!
 * @copyright
 */