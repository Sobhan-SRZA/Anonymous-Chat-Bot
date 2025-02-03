"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = require("fs");
const error_1 = tslib_1.__importDefault(require("../../utils/error"));
const firstUpperCase_1 = tslib_1.__importDefault(require("../../functions/firstUpperCase"));
const markdownToHtml_1 = tslib_1.__importDefault(require("../../functions/markdownToHtml"));
const command = {
    data: {
        name: "help",
        description: "لیست دستورات بات."
    },
    category: "misc",
    cooldown: 2,
    run: async (client, ctx) => {
        try {
            let commandList = "";
            const categories = (0, fs_1.readdirSync)(`${process.cwd()}/dist/src/commands`), botDescription = "";
            categories.forEach(async (dir) => {
                commandList += `**${(0, firstUpperCase_1.default)(dir)}**\n${client.cmds_info_list_str(dir.toLowerCase())}\n`;
            });
            return await ctx.reply((0, markdownToHtml_1.default)(`${botDescription}**لیست دستورات ربات:**\n${commandList}`), {
                parse_mode: "HTML"
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
 * Coded by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * @copyright
 * Work for Persian Caesar | https://dsc.gg/persian-caesar
 * @copyright
 * Please Mention Us "Persian Caesar", When Have Problem With Using This Code!
 * @copyright
 */ 
//# sourceMappingURL=help.js.map