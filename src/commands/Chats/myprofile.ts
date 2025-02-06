import generateReferralLink from "../../utils/generateReferralLink";
import getUserProfile from "../../utils/getUserProfile";
import CommandType from "../../types/command";
import error from "../../utils/error";

const command: CommandType = {
  data: {
    name: "myprofile",
    description: "نمایش پروفایل شما."
  },
  category: "chats",
  cooldown: 5,
  only_privet: true,
  run: async (client, ctx) => {
    try {
      const
        db = client.db!,
        userId = ctx.from?.id,
        profile = await getUserProfile(db, userId),
        referralLink = await generateReferralLink(client, userId);;

      if (!userId)
        return;

      if (!profile)
        return await ctx.reply(
          "شما هنوز پروفایل خود را تنظیم نکرده‌اید. از دستور /setprofile استفاده کنید.",
          { reply_parameters: { message_id: ctx.msgId } }
        );

      return await ctx.reply(
        `پروفایل شما:\nجنسیت: ${profile.gender}\n\nلینک اختصاصی شما برای چت ناشناس: ${referralLink}\nبرای فعال کردن حالت انتظار چت از طریق لینک از دستور /activate_referral استفاده کنید.`,
        { reply_parameters: { message_id: ctx.msgId } }
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