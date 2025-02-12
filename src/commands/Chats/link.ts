import generateReferralLink from "../../utils/generateReferralLink";
import getUserProfile from "../../utils/getUserProfile";
import markdownToHtml from "../../functions/markdownToHtml";
import CommandType from "../../types/command";
import error from "../../utils/error";

const command: CommandType = {
  data: {
    name: "link",
    description: "دریافت لینک ناشناس شما."
  },
  category: "chats",
  cooldown: 2,
  only_privet: true,
  run: async (client, ctx) => {
    try {
      const
        db = client.db!,
        userId = ctx.from.id,
        profile = await getUserProfile(db, userId) || {},
        referralLink = await generateReferralLink(client, userId),
        bannerText = `👤 لینک ناشناس من\n\nسلام ${profile.nickname || ctx.from.first_name} هستم 👋\nلینک زیر رو لمس کن و هر حرفی که تو دلت هست یا هر انتقادی که نسبت به من داری رو راحت بنویس و بفرست. قطعا نظرات و پیام‌هات برام ارزشمنده! 😊\n\n**🔗 لینک ناشناس من:**\n`,
        msg = await ctx.reply(markdownToHtml(bannerText) + referralLink, {
          parse_mode: "HTML",
          reply_parameters: { message_id: ctx.msgId }
        });

      return await ctx.reply(markdownToHtml("👆 پیام بالا رو به دوستات و گروه‌هایی که می‌شناسی فوروارد کن تا بتونن بهت پیام ناشناس بفرستن. پیام‌ها از طریق همین ربات بهت می‌رسه."), {
        parse_mode: "HTML",
        reply_parameters: {
          message_id: msg.message_id
        },
        reply_markup: {
          inline_keyboard: [
            [
              { text: "تغییر نام نمایشی 👤", callback_data: "change_nickname" },
              { text: "پیام خوش آمدگویی 👋🏻", callback_data: "change_welcome_messge" }
            ],
            [
              { text: "بازگشت 🔙", callback_data: "return_start" }
            ]
          ]
        }
      })
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