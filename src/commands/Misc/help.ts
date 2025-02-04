import { readdirSync } from "fs";
import CommandType, { Categories } from "../../types/command";
import error from "../../utils/error";
import firstUpperCase from "../../functions/firstUpperCase";
import markdownToHtml from "../../functions/markdownToHtml";

const command: CommandType = {
  data: {
    name: "help",
    description: "لیست دستورات بات."
  },
  category: "misc",
  cooldown: 2,
  run: async (client, ctx) => {
    try {
      let commandList = "";
      const
        categories = readdirSync(`${process.cwd()}/dist/src/commands`),
        botDescription = "این ربات برای چت خصوصی طراحی شده و شما میتوانید با استفاده از این ربات به صورت ناشناس با بقیه چت کنید بدون لو رفتن هیچ اطلاعاتی از جانب ربات.\n```\nاین ربات چی اطلاعاتی رو ذخیره نمیکند و اطلاعات خصوصی شما بدون خطر لو رفتن فقط توسط شما قابل دسترس میباشد.\n```";

      categories.forEach(async dir => {
        commandList += `**${firstUpperCase(dir)}**\n${client.cmds_info_list_str(dir.toLowerCase() as Categories)}\n`;
      });
      return await ctx.reply(markdownToHtml(`${botDescription}**لیست دستورات ربات:**\n${commandList}`), {
        parse_mode: "HTML"
      })
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