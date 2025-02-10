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
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */