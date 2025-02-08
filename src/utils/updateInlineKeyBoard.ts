import { InlineKeyboardButton, InlineKeyboardMarkup, Message } from "telegraf/typings/core/types/typegram";
import { CtxCallbackQuery } from "../types/MessageContext";

export default async function updateInlineKeyboard(callbackQuery: CtxCallbackQuery, buttonData: { callback_data: string; text: string; }) {
  const
    message = callbackQuery.message as Message.TextMessage,
    currentMarkup = message.reply_markup as InlineKeyboardMarkup,
    keyboard = currentMarkup.inline_keyboard.map(row =>
      row.map((button) => ({ ...button }))
    );

  for (let i = 0; i < keyboard.length; i++)
    for (let j = 0; j < keyboard[i].length; j++) {
      const button = keyboard[i][j] as InlineKeyboardButton.CallbackButton;
      if (callbackQuery.data === button.callback_data)
        keyboard[i][j] = buttonData;

    }


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