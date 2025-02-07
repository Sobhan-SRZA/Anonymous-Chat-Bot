import { UserPermissionDescriptions } from "../types/UserProfile";
import { MyContext } from "../types/MessageContext";
import { Message } from "telegraf/typings/core/types/typegram";
import getOrCreateReferralCode from "./getOrCreateReferralCode";
import getRequiredPermission from "./getRequiredPermission";
import getUserProfile from "./getUserProfile";
import client from "../..";
import error from "./error";
import post from "../functions/post";

export default async function forwardMessageToPartner(ctx: MyContext, partnerId: number, anonymousChat = false) {
  try {
    const
      db = client.db!,
      partnerProfile = await getUserProfile(db, partnerId);

    if (partnerProfile && partnerProfile.permissions) {
      const requiredPermission = getRequiredPermission(ctx.message);
      if (requiredPermission)
        if (!partnerProfile.permissions[requiredPermission]) {
          const description = UserPermissionDescriptions[requiredPermission];
          return await ctx.reply(`شریک چت اجازه ${description} را ندارد.`);
        }

    }

    const
      message = ctx.message as Message.TextMessage,
      data: any = {},
      getUserCode = await getOrCreateReferralCode(db, ctx.from!.id),
      getPartnerCode = await getOrCreateReferralCode(db, partnerId);

    if (!anonymousChat)
      data.reply_markup = {
        inline_keyboard: [
          [
            { text: "پاسخ ✍🏻", callback_data: `answer_${getUserCode}` },
            { text: "بلاک ⛔", callback_data: `block_${getUserCode}` }
          ]
        ]
      };

    if (message.reply_to_message) {
      let message_id = message.reply_to_message.message_id;
      if (message.reply_to_message.from!.id === ctx.from!.id)
        message_id++;

      else
        message_id--;

      data.reply_to_message_id = message_id;
    }

    let forwardedMessage: any;
    forwardedMessage = await ctx.telegram.copyMessage(
      partnerId,
      ctx.chat!.id,
      message.message_id,
      data
    ).catch(async () => {
      forwardedMessage = await ctx.telegram.copyMessage(
        partnerId,
        ctx.chat!.id,
        message.message_id,
        {
          reply_markup: data.reply_markup
        }
      )
    });

    if (!anonymousChat)
      await ctx.reply("🔹 کنترل چت:", {
        reply_markup: {
          inline_keyboard: [
            [
              { text: "⛔ اتمام چت", callback_data: `end_chat_${getPartnerCode}` },
              { text: "▶️ ادامه چت", callback_data: `continue_chat_${getPartnerCode}` },
              { text: "🗑 حذف پیام", callback_data: `delete_message_${forwardedMessage?.message_id}` }
            ]
          ]
        },
        reply_parameters: {
          message_id: message.message_id
        }
      });

    return forwardedMessage;
  } catch (e: any) {
    post("Error copying message:", "E", "red", "red")
    error(e);

    return await ctx.reply("خطایی در ارسال پیام به شریک چت رخ داد.", {
      reply_parameters: { message_id: ctx.msgId! }
    });
  }
}
/**
 * @copyright
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */