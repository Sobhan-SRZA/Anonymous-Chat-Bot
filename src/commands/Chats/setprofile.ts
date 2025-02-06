import CommandType from "../../types/command";
import error from "../../utils/error";

const command: CommandType = {
  data: {
    name: "setprofile",
    description: "تنظیم پروفایل."
  },
  category: "chats",
  cooldown: 5,
  only_privet: true,
  run: async (client, ctx) => {
    try {
      return await ctx.reply(
        "لطفاً جنسیت خود را انتخاب کنید:",
        {
          reply_parameters: { message_id: ctx.msgId },
          reply_markup: {
            inline_keyboard: [
              [
                { text: "Male", callback_data: "set_gender_male" },
                { text: "Female", callback_data: "set_gender_female" },
                { text: "Other", callback_data: "set_gender_other" }
              ]
            ]
          }
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