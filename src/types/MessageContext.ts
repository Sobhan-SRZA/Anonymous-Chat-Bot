import { Scenes } from "telegraf";
import { MaybeInaccessibleMessage, User } from "telegraf/typings/core/types/typegram";

// Custom telegraf context
type MyContext = Scenes.WizardContext;

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