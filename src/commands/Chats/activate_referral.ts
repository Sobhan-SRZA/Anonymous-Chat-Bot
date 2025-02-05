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
      const userId = ctx.from!.id;
      if (!userId)
        return;

      client.referralWaiting.add(userId);
      return await ctx.reply(
        "حالت انتظار برای چت از طریق لینک فعال شد. اکنون کاربران دیگر با استفاده از لینک شما می‌توانند وارد چت شوند.",
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