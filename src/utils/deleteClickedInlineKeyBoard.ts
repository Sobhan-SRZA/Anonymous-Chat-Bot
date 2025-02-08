import { InlineKeyboardButton, InlineKeyboardMarkup, Message } from "telegraf/typings/core/types/typegram";
import { CtxCallbackQuery } from "../types/MessageContext";

export default async function deleteClickedInlineKeyBoard(callbackQuery: CtxCallbackQuery, noFilter?: (button: InlineKeyboardButton.CallbackButton) => boolean): Promise<InlineKeyboardButton[][]> {
  const
    message = callbackQuery.message as Message.TextMessage,
    currentMarkup = message.reply_markup as InlineKeyboardMarkup;

  let keyboard: InlineKeyboardButton[][] = currentMarkup.inline_keyboard.map(row => [...row]);

  keyboard = keyboard.map(row =>
    row.filter((button) => {
      const cbButton = button as InlineKeyboardButton.CallbackButton;
      if (!noFilter)
        return cbButton.callback_data !== callbackQuery.data;

      return noFilter(cbButton);
    })
  );

  keyboard = keyboard.filter(row => row.length > 0);

  return keyboard;
}
/**
 * @copyright
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */