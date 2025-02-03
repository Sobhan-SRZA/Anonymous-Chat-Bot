"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const error_1 = tslib_1.__importDefault(require("../../utils/error"));
const checkCmdCooldown_1 = tslib_1.__importDefault(require("../../utils/checkCmdCooldown"));
exports.default = async (client, message) => {
    try {
        const db = client.db;
        // Filter the bots
        if (message.from.is_bot)
            return;
        if (message.text && message.text.startsWith("/")) {
            const args = message.text.slice(1).trim().split(/ +/g), commandName = args.shift().toLowerCase(), command = client.commands.get(commandName) ||
                client.commands.find(a => a.aliases && a.aliases.includes(commandName));
            if (!command)
                return await message.sendMessage("⚠دستور تعریف نشده!");
            // Cooldown
            if (await (0, checkCmdCooldown_1.default)(client, message, command))
                return;
            // Command Handler
            await db.add("totalCommandsUsed", 1);
            return command.run(message);
        }
    }
    catch (e) {
        (0, error_1.default)(e);
    }
};
/**
 * @copyright
 * Coded by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * @copyright
 * Work for Persian Caesar | https://dsc.gg/persian-caesar
 * @copyright
 * Please Mention Us "Persian Caesar", When Have Problem With Using This Code!
 * @copyright
 */ 
//# sourceMappingURL=message.js.map