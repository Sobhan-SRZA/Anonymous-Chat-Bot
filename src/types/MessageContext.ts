import { MaybeInaccessibleMessage, Update, User } from "telegraf/typings/core/types/typegram";
import { Context, Scenes } from "telegraf";
import { Collection } from "../classes/Collection";

// Custom session
interface MySession extends Scenes.SceneSessionData {
    lastMessage?: Collection<number, {
        text: string | undefined;
        chat: {
            id: number;
            type: "private" | "group" | "supergroup" | "channel";
        };
        from: {
            id: number;
            username: string | undefined
        };
        message_id: number | undefined;
        to?: number;
    }>;
}

// Custom telegraf context
interface MyContext extends Context, Scenes.SceneContext<MySession> { }

// Rewrite the type by myself
interface CtxCallbackQuery {
    id: string;
    from: User;
    message?: MaybeInaccessibleMessage;
    inline_message_id?: string;
    chat_instance: string;
    data: string;
    game_short_name: string;
}

// Export other types
export type {
    MyContext,
    CtxCallbackQuery
}
/**
 * @copyright
 * Coded by Sobhan-SRZA and Aria Fendereski | https://github.com/Sobhan-SRZA | https://github.com/ariafi
 * @copyright
 * Work for Vixium Team | https://discord.gg/vefvUNyPQu
 * @copyright
 */