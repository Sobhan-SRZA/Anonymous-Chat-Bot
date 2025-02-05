import { Context } from "telegraf";
import { MaybeInaccessibleMessage, User } from "telegraf/typings/core/types/typegram";

// Custom session
interface MySession {
    lastMessage?: {
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
    };
}

// Custom telegraf context
interface MyContext extends Context {
    session: MySession;
}

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