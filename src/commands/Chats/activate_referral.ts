import CommandType from "../../types/command";
import error from "../../utils/error";

const command: CommandType = {
  data: {
    name: "activate_referral",
    description: "فعال سازی لینک برای حالت انتظار."
  },
  category: "chats",
  cooldown: 5,
  only_privet: true,
  run: async (client, ctx) => {
    try {
      const userId = ctx.from?.id;
      if (!userId)
        return;

      client.referralWaiting.add(userId);
      return await ctx.reply("حالت انتظار برای چت از طریق لینک فعال شد. اکنون کاربران دیگر با استفاده از لینک شما می‌توانند وارد چت شوند.");
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