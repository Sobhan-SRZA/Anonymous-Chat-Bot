import { startMessageButtons } from "../../utils/startMessage";
import { ExtraReplyMessage } from "telegraf/typings/telegram-types";
import { Message } from "telegraf/typings/core/types/typegram";
import getUserIdByReferralCode from "../../utils/getUserIdByReferralCode";
import getUserProfile from "../../utils/getUserProfile";
import markdownToHtml from "../../functions/markdownToHtml";
import setUserProfile from "../../utils/setUserProfile";
import CommandType from "../../types/command";
import cleanupUser from "../../utils/cleanupUser";
import error from "../../utils/error";

const command: CommandType = {
  data: {
    name: "start",
    description: "شروع چت."
  },
  category: "misc",
  cooldown: 5,
  only_privet: true,
  run: async (client, ctx, args) => {
    try {
      const
        db = client.db!,
        userId = ctx.from.id,
        userProfile = await getUserProfile(db, userId);

      if (args[0]) {
        const referrerId = await getUserIdByReferralCode(db, args[0]);
        if (!referrerId)
          return await ctx.reply(
            markdownToHtml("ارتباط بر قرار نشد 😕\nبنظر میرسه کد اشتباه وارد شده و یا اینکه منقضی شده پس بهتره از یه کد جدید استفاده بکنی."),
            { parse_mode: "HTML", reply_parameters: { message_id: ctx.msgId } }
          )

        if (referrerId.toString() === ctx.from.id.toString())
          return await ctx.reply(
            markdownToHtml("حالت خوبه؟ اگه بخوای شماره روانشناسم رو بهت بدم باهاش حرف بزن شاید کمک کرد!\nدرک میکنم بعضی وقتا با خودمون حرف میزنیم ولی من نمیتونم در این مورد بهت کمک کنم 😶"),
            {
              parse_mode: "HTML",
              reply_markup: {
                inline_keyboard: [
                  [
                    { text: "بازگشت به منوی شروع 🏠", callback_data: "return_start" }
                  ]
                ]
              },
              reply_parameters: { message_id: ctx.msgId }
            }
          )

        client.activeChats.set(userId, referrerId);
        client.activeChats.set(referrerId, userId);
        await ctx.reply(
          markdownToHtml(`شما با **${userProfile!.nickname || `User_${args[0]}`}** جفت شدید. میتونید پیام هاتون رو ارسال کنید.`),
          {
            parse_mode: "HTML",
            reply_parameters: {
              message_id: ctx.msgId
            }
          }
        )
        try {
          return await client.telegram.sendMessage(
            referrerId,
            "شما با یک کاربر ناشناس از طریق لینک جفت شدید! اکنون می‌توانید پیام‌هایتان را رد و بدل کنید."
          );
        } catch (err) {
          await ctx.reply("متاسفانه پیام به کاربر مقابل ارسال نشد.");
          return await cleanupUser(client, userId);
        }
      }

      let message: Message.TextMessage | null = null;
      if (!userProfile) {
        message = await ctx.reply(
          markdownToHtml(`سلام **${ctx.from.first_name}**!👋🏻\nبه ربات چت خصوصی خوش اومدی💋`),
          { parse_mode: "HTML", reply_parameters: { message_id: ctx.msgId } }
        );
        await setUserProfile(db, ctx.from.id, {});
      }

      const replyData: ExtraReplyMessage = {
        reply_markup: startMessageButtons
      };

      if (!message || !message.text)
        replyData.reply_parameters = {
          message_id: ctx.msgId!
        };

      return await ctx.reply(
        "چه کاری برات انجام بدم؟",
        replyData
      );
    } catch (e: any) {
      error(e)
    }
  }
};

export default command;
/**
 * @copyright
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */