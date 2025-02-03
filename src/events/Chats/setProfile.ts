import error from "../../utils/error";
import { CtxCallbackQuery, MyContext } from "../../types/MessageContext";
import EventType from "../../types/EventType";
import { CallbackQuery, Update } from "telegraf/typings/core/types/typegram";
import { Context } from "telegraf";
import setUserProfile from "../../utils/setUserProfile";

const event: EventType = {
 name: "callback_query",
 run: async (
  client,
  message: Context<Update.CallbackQueryUpdate<CallbackQuery>> & Omit<MyContext, keyof Context<Update>> & {
   match: RegExpExecArray;
  }
 ) => {
  try {
   const
    db = client.db!,
    callbackQuery: CtxCallbackQuery = message.callbackQuery as any;

   if (callbackQuery.data.match(/set_gender_(.+)/)) {
    const
     gender = callbackQuery.data.replace("set_gender_", ""),
     userId = message.from?.id;

    if (!userId)
     return;

    await setUserProfile(db, userId, { gender });
    await message.answerCbQuery("پروفایل شما به‌روزرسانی شد!");
    return await message.editMessageText(`پروفایل شما تنظیم شد: جنسیت شما ${gender} است.`, {
     reply_markup: {
      inline_keyboard: [
       []
      ]
     }
    });
   }
  } catch (e: any) {
   error(e);
  }
 }
};

export default event;
/**
 * @copyright
 * Coded by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * @copyright
 * Work for Persian Caesar | https://dsc.gg/persian-caesar
 * @copyright
 * Please Mention Us "Persian Caesar", When Have Problem With Using This Code!
 * @copyright
 */