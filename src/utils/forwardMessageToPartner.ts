import { InlineKeyboardMarkup, Message } from "telegraf/typings/core/types/typegram";
import { UserPermissionDescriptions } from "../types/UserProfile";
import { MyContext } from "../types/MessageContext";
import getOrCreateReferralCode from "./getOrCreateReferralCode";
import getRequiredPermission from "./getRequiredPermission";
import getUserProfile from "./getUserProfile";
import client from "../..";
import error from "./error";
import post from "../functions/post";

export default async function forwardMessageToPartner(ctx: MyContext, partnerId: number) {
  try {
    const
      db = client.db!,
      partnerProfile = await getUserProfile(db, partnerId);

    if (partnerProfile && partnerProfile.permissions) {
      const requiredPermission = getRequiredPermission(ctx.message);
      if (requiredPermission)
        if (!partnerProfile.permissions[requiredPermission]) {
          const description = UserPermissionDescriptions[requiredPermission];
          await ctx.reply(`شریک چت اجازه ${description} را ندارد.`);
          return;
        }

    }

    const
      message = ctx.message as Message.TextMessage,
      data: any = { parse_mode: "Markdown" },
      getUserCode = await getOrCreateReferralCode(db, ctx.from!.id),
      getPartnerCode = await getOrCreateReferralCode(db, partnerId),
      userMessageDB = `${ctx.from!.id}.${partnerId}`,
      userMessages = await client.chatMessages.get(userMessageDB);

    data.reply_markup = {
      inline_keyboard: [
        [
          { text: "پاسخ ✍🏻", callback_data: `answer_${getUserCode}` },
          { text: "بلاک ⛔", callback_data: `block_${getUserCode}` }
        ]
      ]
    };
    if (message.reply_to_message) {
      let
        message_id = message.reply_to_message.message_id,
        partnerMessages = userMessages?.find(a => a[0].message_id === message_id);

      if (partnerMessages)
        data.reply_to_message_id = partnerMessages[1].message_id;

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
          parse_mode: "Markdown",
          reply_markup: data.reply_markup
        }
      )
    });

    const control_message = await ctx.reply("🔹 کنترل چت:", {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "⛔ اتمام چت", callback_data: `end_chat_${getPartnerCode}` },
            { text: "▶️ ادامه چت", callback_data: `continue_chat_${getPartnerCode}` }
          ],
          [
            { text: "🗑 حذف پیام", callback_data: `delete_message_${forwardedMessage?.message_id}-${message.message_id}-${getPartnerCode}` },
            { text: "✍🏻 ویرایش پیام", callback_data: `edit_message_${forwardedMessage?.message_id}-${getPartnerCode}` }
          ]
        ]
      },
      reply_parameters: {
        message_id: message.message_id
      }
    });

    return {
      message_id: forwardedMessage.message_id as number,
      reply_markup: data.reply_markup as InlineKeyboardMarkup,
      control_message_id: control_message.message_id as number
    };
  } catch (e: any) {
    post("Error copying message:", "E", "red", "red")
    error(e);

    await ctx.reply("خطایی در ارسال پیام به شریک چت رخ داد.", {
      reply_parameters: { message_id: ctx.msgId! }
    });
    return;
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