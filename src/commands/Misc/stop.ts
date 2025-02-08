import CommandType from "../../types/command";
import cleanupUser from "../../utils/cleanupUser";
import error from "../../utils/error";

const command: CommandType = {
  data: {
    name: "stop",
    description: "قطع کردن چت فعلی و پاکسازی کاربر از صف‌های انتظار."
  },
  category: "misc",
  cooldown: 5,
  only_privet: true,
  run: async (client, ctx) => {
    try {
      const
        userId = ctx.from?.id,
        isHasActiveChat = await client.activeChats.has(`${userId}`);

      if (!userId)
        return;

      await cleanupUser(client, userId);

      if (isHasActiveChat)
        return await ctx.reply(
          "چت شما خاتمه یافت.",
          {
            reply_markup: {
              inline_keyboard: [
                [
                  { text: "بازگشت به منوی شروع 🏠", callback_data: "return_start" }
                ]
              ]
            },
            reply_parameters: { message_id: ctx.msgId }
          }
        );

      return await ctx.reply(
        "چتی برای خاتمه دادن وجود ندارد :)",
        {
          reply_markup: {
            inline_keyboard: [
              [
                { text: "بازگشت به منوی شروع 🏠", callback_data: "return_start" }
              ]
            ]
          },
          reply_parameters: { message_id: ctx.msgId }
        }
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