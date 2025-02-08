"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = require("fs");
const firstUpperCase_1 = tslib_1.__importDefault(require("../../functions/firstUpperCase"));
const markdownToHtml_1 = tslib_1.__importDefault(require("../../functions/markdownToHtml"));
const error_1 = tslib_1.__importDefault(require("../../utils/error"));
const command = {
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
            const categories = (0, fs_1.readdirSync)(`${process.cwd()}/dist/src/commands`), botDescription = "این ربات برای چت خصوصی طراحی شده و شما میتوانید با استفاده از این ربات به صورت ناشناس با بقیه چت کنید بدون لو رفتن هیچ اطلاعاتی از جانب ربات.\n```\nاین ربات چی اطلاعاتی رو ذخیره نمیکند و اطلاعات خصوصی شما بدون خطر لو رفتن فقط توسط شما قابل دسترس میباشد.\n```\n";
            categories.forEach(async (dir) => {
                commandList += `**${(0, firstUpperCase_1.default)(dir)}**\n${client.cmds_info_list_str(dir.toLowerCase())}\n`;
            });
            return await ctx.reply((0, markdownToHtml_1.default)(`${botDescription}**لیست دستورات ربات:**\n${commandList}`), {
                parse_mode: "HTML",
                reply_parameters: { message_id: ctx.msgId }
            });
        }
        catch (e) {
            (0, error_1.default)(e);
        }
    }
};
exports.default = command;
/**
 * @copyright
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */ 
//# sourceMappingURL=help.js.map