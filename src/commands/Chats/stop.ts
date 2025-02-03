import CommandType from "../../types/command";
import cleanupUser from "../../utils/cleanupUser";
import error from "../../utils/error";

const command: CommandType = {
  data: {
    name: "stop",
    description: "قطع کردن چت فعلی و پاکسازی کاربر از صف‌های انتظار."
  },
  category: "chats",
  cooldown: 5,
  run: async (client, ctx) => {
    try {
      const userId = ctx.from?.id;
      if (!userId)
        return;

      await cleanupUser(client, userId);
      return await ctx.reply("چت شما خاتمه یافت. برای شروع چت جدید از دستورات /anon یا /random استفاده کنید.");
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