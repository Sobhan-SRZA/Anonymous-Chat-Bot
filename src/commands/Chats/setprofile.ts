import CommandType from "../../types/command";
import error from "../../utils/error";
import { Markup } from "telegraf";

const command: CommandType = {
  data: {
    name: "setprofile",
    description: "تنظیم پروفایل."
  },
  category: "chats",
  cooldown: 5,
  run: async (client, ctx) => {
    try {
      return await ctx.reply(
        'لطفاً جنسیت خود را انتخاب کنید:',
        Markup.inlineKeyboard([
          Markup.button.callback('Male', 'set_gender_male'),
          Markup.button.callback('Female', 'set_gender_female'),
          Markup.button.callback('Other', 'set_gender_other')
        ])
      );
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