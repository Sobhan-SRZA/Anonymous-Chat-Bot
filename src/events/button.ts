import { getToggleButton, PermissionNames, permissionsMapping } from "../types/UserProfile";
import { CtxCallbackQuery, MyContext } from "../types/MessageContext";
import { CallbackQuery, Update, Message } from "telegraf/typings/core/types/typegram";
import { startMessageButtons } from "../utils/startMessage";
import { Context } from "telegraf";
import updateInlineKeyboard from "../utils/updateInlineKeyBoard";
import getUserProfile from "../utils/getUserProfile";
import markdownToHtml from "../functions/markdownToHtml";
import setUserProfile from "../utils/setUserProfile";
import EventType from "../types/EventType";
import error from "../utils/error";

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
     gender = callbackQuery.data.replace("set_gender_", "") as "male" | "female",
     userId = message.from!.id;

    await setUserProfile(db, userId, { gender });
    await message.answerCbQuery("پروفایل شما به‌روزرسانی شد!");
    return await message.editMessageText(`پروفایل شما تنظیم شد: جنسیت شما ${gender} است.`);
   }

   switch (callbackQuery.data) {

    // Start Buttons
    case "setting": {
     await message.answerCbQuery("تنظیمات پروفایل شما در ربات.");
     const
      profile = await getUserProfile(db, callbackQuery.from.id) || {},
      inline_keyboard: { text: string; callback_data: string }[][] = [];

     if (!profile.permissions) {

      // Default permissions 
      profile.permissions = {
       found_user_link: true,
       random_chat: true,
       send_circule_video: true,
       send_file: true,
       send_gif: true,
       send_image: true,
       send_music: true,
       send_sticker: true,
       send_text: true,
       send_video: true,
       send_voice: true
      };

      await setUserProfile(db, callbackQuery.from.id, profile);
     }

     inline_keyboard.push([{ text: "تغییر نام نمایشی 👤", callback_data: "change_nickname" }]);
     inline_keyboard.push([{ text: "پیام خوش آمدگویی 👋🏻", callback_data: "change_welcome_message" }]);

     for (const permissionKey in permissionsMapping) {
      const
       key = permissionKey as PermissionNames,
       mapping = permissionsMapping[key],
       isEnabled = !!profile.permissions[key];

      inline_keyboard.push([
       getToggleButton(key, isEnabled),
       { text: mapping.label, callback_data: mapping.infoCallback },
      ]);
     }

     inline_keyboard.push([{ text: "بازگشت ↩", callback_data: "return_start" }]);

     return await message.editMessageText("تنظیمات:", {
      reply_markup: { inline_keyboard },
     });
    }

    // Setting buttons
    case "change_nickname": {
     await message.answerCbQuery("تغییر نام نمایشی در ربات");
     const
      profile = await getUserProfile(client.db!, message.callbackQuery.from.id),
      buttons: { text: string; callback_data: string }[][] = [];

     buttons.push([
      { text: "حذف 🗑", callback_data: callbackQuery.data.replace("change", "delete") }
     ]);

     buttons.push([
      { text: "بازگشت ↩", callback_data: "setting" }
     ]);

     const msg = await message.editMessageText(
      markdownToHtml(`برای تغییر نام نمایشی، نام را ارسال کنید.${profile && profile.nickname ?
       `نام نمایشی فعلی شما: \`\`\`\n${profile.nickname}\n\`\`\`` : ""
       }`),
      {
       parse_mode: "HTML",
       reply_markup: {
        inline_keyboard: buttons
       }
      }
     ) as Update.Edited & Message.TextMessage;
     message.session.lastMessage = {
      text: msg.text,
      message_id: msg.message_id,
      chat: {
       id: msg.chat.id,
       type: msg.chat.type
      },
      from: {
       id: msg.from!.id,
       username: msg.from!.username
      }
     }
     return;
    }

    case "change_welcome_message": {
     await message.answerCbQuery("تغییر پیغام خوش آمد گویی در چت.");
     const
      profile = await getUserProfile(client.db!, callbackQuery.from.id),
      buttons: { text: string; callback_data: string }[][] = [];

     buttons.push([
      { text: "حذف 🗑", callback_data: callbackQuery.data.replace("change", "delete") }
     ]);

     buttons.push([
      { text: "بازگشت ↩", callback_data: "setting" }
     ]);

     const msg = await message.editMessageText(
      markdownToHtml(`برای تغییر پیغام خوش آمد گویی چت، مثل مورد نظر رو ارسال کنید.${profile && profile.welcome_message ?
       `پیغام فعلی شما: \`\`\`\n${profile.welcome_message}\n\`\`\`` : ""
       }`),
      {
       parse_mode: "HTML",
       reply_markup: {
        inline_keyboard: buttons
       }
      }
     ) as Update.Edited & Message.TextMessage;
     message.session.lastMessage = {
      text: msg.text,
      message_id: msg.message_id,
      chat: {
       id: msg.chat.id,
       type: msg.chat.type
      },
      from: {
       id: msg.from!.id,
       username: msg.from!.username
      }
     }
     return;
    }

    case "info_random_chat": {
     return await message.answerCbQuery("بقیه بتونن بدون استفاده از لینک به طور تصادفی باهات چت کنن؟", { show_alert: true });
    }

    case "info_found_user_link": {
     return await message.answerCbQuery("بقیه بتونن لینک چت خصوصیت رو از طریق ربات پیدا کنن؟", { show_alert: true });
    }

    case "info_send_text": {
     return await message.answerCbQuery("توی چت خصوصی بتونن برات پیام متنی بفرستن؟", { show_alert: true });
    }

    case "info_send_image": {
     return await message.answerCbQuery("توی چت خصوصی بتونن برات عکس بفرستن؟", { show_alert: true });
    }

    case "info_send_video": {
     return await message.answerCbQuery("توی چت خصوصی بتونن برات ویدیو بفرستن؟", { show_alert: true });
    }

    case "info_send_circule_video": {
     return await message.answerCbQuery("توی چت خصوصی بتونن برات ویدیو گرد بفرستن؟", { show_alert: true });
    }

    case "info_send_gif": {
     return await message.answerCbQuery("توی چت خصوصی بتونن برات گیف بفرستن؟", { show_alert: true });
    }

    case "info_send_music": {
     return await message.answerCbQuery("توی چت خصوصی بتونن برات موزیک بفرستن؟", { show_alert: true });
    }

    case "info_send_voice": {
     return await message.answerCbQuery("توی چت خصوصی بتونن برات ویس بفرستن؟", { show_alert: true });
    }

    case "info_send_file": {
     return await message.answerCbQuery("توی چت خصوصی بتونن برات فایل بفرستن؟", { show_alert: true });
    }

    case "info_send_sticker": {
     return await message.answerCbQuery("توی چت خصوصی بتونن برات استیکر بفرستن؟", { show_alert: true });
    }

    case "return_start": {
     await message.answerCbQuery("بازگشت به منوی شروع");
     return await message.editMessageText("چه کاری برات انجام بدم؟", { reply_markup: startMessageButtons });
    }
   }

   // Do settings button actions
   if (callbackQuery.data.endsWith("_on") || callbackQuery.data.endsWith("_off")) {
    console.log(callbackQuery);
    const
     permission_name = callbackQuery.data.replace("_on", "").replace("_off", "") as PermissionNames,
     action = callbackQuery.data.endsWith("_on") ? true : false,
     action_text = action ? "فعال ✅" : "غیر فعال ❌",
     new_callback_data = action ? permission_name + "_off" : permission_name + "_on",
     newButtons = await updateInlineKeyboard(callbackQuery, { text: action_text, callback_data: new_callback_data });

    const userProfile = await getUserProfile(db, callbackQuery.from.id) || {};
    userProfile.permissions![permission_name] = action;
    await setUserProfile(db, callbackQuery.from.id, userProfile);
    await message.answerCbQuery(action_text);
    return await message.editMessageReplyMarkup({ inline_keyboard: newButtons });
   }
  } catch (e: any) {
   error(e);
  }
 }
};

export default event;
/**
 * @copyright
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */