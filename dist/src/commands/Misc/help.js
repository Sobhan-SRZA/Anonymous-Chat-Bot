"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = require("fs");
const __1 = tslib_1.__importDefault(require("../../.."));
const error_1 = tslib_1.__importDefault(require("../../utils/error"));
const firstUpperCase_1 = tslib_1.__importDefault(require("../../functions/firstUpperCase"));
const escapeMarkdown_1 = tslib_1.__importDefault(require("../../functions/escapeMarkdown"));
const command = {
    data: {
        name: "help",
        description: "لیست دستورات بات."
    },
    category: "misc",
    cooldown: 10,
    only_owner: false,
    run: async (ctx) => {
        try {
            let commandList = "";
            const categories = (0, fs_1.readdirSync)(`${process.cwd()}/dist/src/commands`), botDescription = "";
            categories.forEach(async (dir) => {
                commandList += `**${(0, firstUpperCase_1.default)(dir)}**\n${__1.default.cmds_info_list_str(dir.toLowerCase())}\n`;
            });
            return await ctx.replyWithMarkdownV2((0, escapeMarkdown_1.default)(`${botDescription}**لیست دستورات ربات:**\n${commandList}`));
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