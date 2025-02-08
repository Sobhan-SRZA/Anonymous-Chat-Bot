import { readdirSync } from "fs";
import CommandType, { Categories } from "../../types/command";
import firstUpperCase from "../../functions/firstUpperCase";
import markdownToHtml from "../../functions/markdownToHtml";
import error from "../../utils/error";

const command: CommandType = {
  data: {
    name: "help",
    description: "لیست دستورات بات."
  },
  category: "misc",
  cooldown: 2,
  only_privet: true,
  run: async (client, ctx) => {
    try {
      let commandList = "";
      const
        categories = readdirSync(`${process.cwd()}/dist/src/commands`),
        botDescription = "این ربات برای چت خصوصی طراحی شده و شما میتوانید با استفاده از این ربات به صورت ناشناس با بقیه چت کنید بدون لو رفتن هیچ اطلاعاتی از جانب ربات.\n```\nاین ربات چی اطلاعاتی رو ذخیره نمیکند و اطلاعات خصوصی شما بدون خطر لو رفتن فقط توسط شما قابل دسترس میباشد.\n```\n";

      categories.forEach(async dir => {
        commandList += `**${firstUpperCase(dir)}**\n${client.cmds_info_list_str(dir.toLowerCase() as Categories)}\n`;
      });
      return await ctx.reply(
        markdownToHtml(`${botDescription}**لیست دستورات ربات:**\n${commandList}`),
        {
          parse_mode: "HTML",
          reply_parameters: { message_id: ctx.msgId }
        }
      )
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