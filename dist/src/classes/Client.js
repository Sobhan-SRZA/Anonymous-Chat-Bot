"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const config_1 = tslib_1.__importDefault(require("../../config"));
const telegraf_1 = require("telegraf");
const Collection_1 = require("./Collection");
class TelegramClient extends telegraf_1.Telegraf {
    commands;
    cooldowns;
    config;
    db;
    constructor(token, options) {
        super(token || config_1.default.bot.token, options);
        this.config = config_1.default;
        this.commands = new Collection_1.Collection();
        this.cooldowns = new Collection_1.Collection();
        this.db = null;
    }
    cmds_info_list_str(category_name) {
        let description = "";
        this.commands
            .filter(cmd => cmd.category === category_name)
            .forEach((cmd) => {
            description += `/${cmd.data.name} - \`${cmd.data.description}\`\n`;
        });
        return description;
    }
}
exports.default = TelegramClient;
/**
 * @copyright
 * Coded by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * @copyright
 * Work for Persian Caesar | https://dsc.gg/persian-caesar
 * @copyright
 * Please Mention Us "Persian Caesar", When Have Problem With Using This Code!
 * @copyright
 */ 
//# sourceMappingURL=Client.js.map