import CommandType from "../../types/command";
import error from "../../utils/error";
import generateReferralLink from "../../utils/generateReferralLink";
import getUserProfile from "../../utils/getUserProfile";

const command: CommandType = {
  data: {
    name: "myprofile",
    description: "نمایش پروفایل شما."
  },
  category: "chats",
  cooldown: 5,
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
        return await ctx.reply('شما هنوز پروفایل خود را تنظیم نکرده‌اید. از دستور /setprofile استفاده کنید.');

      await ctx.reply(`پروفایل شما:\nجنسیت: ${profile.gender}\n\nلینک اختصاصی شما برای چت ناشناس: ${referralLink}\nبرای فعال کردن حالت انتظار چت از طریق لینک از دستور /activate_referral استفاده کنید.`);
    } catch (e: any) {
      error(e)
    }
  }
};
export default command;
/**
 * @copyright
 * Coded by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * @copyright
 * Work for Persian Caesar | https://dsc.gg/persian-caesar
 * @copyright
 * Please Mention Us "Persian Caesar", When Have Problem With Using This Code!
 * @copyright
 */