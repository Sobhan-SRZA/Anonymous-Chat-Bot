import { startMessageButtons } from "../../utils/startMessage";
import { ExtraReplyMessage } from "telegraf/typings/telegram-types";
import { Message } from "telegraf/typings/core/types/typegram";
import getUserIdByReferralCode from "../../utils/getUserIdByReferralCode";
import checkUserIsBlock from "../../utils/checkUserIsBlock";
import getUserProfile from "../../utils/getUserProfile";
import markdownToHtml from "../../functions/markdownToHtml";
import setUserProfile from "../../utils/setUserProfile";
import setLastMessage from "../../utils/setLastMessage";
import CommandType from "../../types/command";
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
        userProfile = await getUserProfile(db, userId),
        data: ExtraReplyMessage = {
          parse_mode: "HTML",
          reply_markup: {
            inline_keyboard: [
              [
                { text: "بازگشت به منوی شروع 🏠", callback_data: "return_start" }
              ]
            ]
          },
          reply_parameters: { message_id: ctx.msgId }
        };

      if (args[0]) {
        const referrerId = await getUserIdByReferralCode(db, args[0]);
        if (!referrerId)
          return await ctx.reply(
            markdownToHtml("ارتباط بر قرار نشد 😕\nبنظر میرسه کد اشتباه وارد شده و یا اینکه منقضی شده پس بهتره از یه کد جدید استفاده بکنی."),
            data
          )

        if (referrerId.toString() === ctx.from.id.toString())
          return await ctx.reply(
            markdownToHtml("حالت خوبه؟ اگه بخوای شماره روانشناسم رو بهت بدم باهاش حرف بزن شاید کمک کرد!\nدرک میکنم بعضی وقتا با خودمون حرف میزنیم ولی من نمیتونم در این مورد بهت کمک کنم 😶"),
            data
          )

        const partnerProfile = await getUserProfile(db, referrerId);
        if (!partnerProfile)
          return await ctx.reply(
            markdownToHtml("بنظر میرسه کسی که با این کد لینک خصوصی داره هنوز پروفایلی نداره :/"),
            data
          );

        if (await checkUserIsBlock(
          client.blocks!,
          ctx,
          userId,
          referrerId,
          async (ctx) => await ctx.reply(
            markdownToHtml("کاربر مالک این کد قبلا توسط شما مسدود شده است.\n```\n**برای خارج سازی از مسدودی، از دستور /settings استفاده کنید!**\n```"),
            data
          ),
          async (ctx) => await ctx.reply(
            markdownToHtml("شما توسط کاربر مالک کد مسدود هستید."),
            data
          )
        ))
          return;

        const msg = await ctx.reply(
          markdownToHtml(`ارتباط با **${partnerProfile.nickname || `User_${args[0]}`}** برقرار شد؛ حرفی، سخنی، انتقادی، نظری یا هرچی داشتی الان میتونی بفرستی و براش ارسال بشه.${"\n\n" + (partnerProfile.welcome_message || "")}`),
          {
            parse_mode: "HTML",
            reply_markup: {
              inline_keyboard: [
                [
                  { text: "انصراف", callback_data: "cancel_sending" }
                ]
              ]
            },
            reply_parameters: {
              message_id: ctx.msgId
            }
          }
        )
        
        // Set last message to answer  
        setLastMessage(ctx, msg, null, referrerId);

        await ctx.scene.enter("continue_or_answer_chat");
        return;
      }

      let message: Message.TextMessage | null = null;
      if (!userProfile) {
        message = await ctx.reply(
          markdownToHtml(`سلام **${ctx.from.first_name}**!👋🏻\nبه ربات چت خصوصی خوش اومدی💋`),
          { parse_mode: "HTML", reply_parameters: { message_id: ctx.msgId } }
        );
        await setUserProfile(db, { id: userId, name: ctx.from.first_name, username: ctx.from.username?.toLowerCase() }, {});
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