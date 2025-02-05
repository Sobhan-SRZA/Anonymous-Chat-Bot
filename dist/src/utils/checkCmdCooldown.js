"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = checkCmdCooldown;
const tslib_1 = require("tslib");
const error_1 = tslib_1.__importDefault(require("./error"));
const Collection_1 = require("../classes/Collection");
const __1 = tslib_1.__importDefault(require("../.."));
const markdownToHtml_1 = tslib_1.__importDefault(require("../functions/markdownToHtml"));
async function checkCmdCooldown(message, command) {
    try {
        const userId = message.from.id;
        if (!__1.default.cooldowns.has(command.data.name))
            __1.default.cooldowns.set(command.data.name, new Collection_1.Collection());
        const timestamps = __1.default.cooldowns.get(command.data.name), cooldownDuration = (command.cooldown ?? 3), cooldownAmount = cooldownDuration * 1000;
        let msg;
        if (timestamps.has(userId)) {
            const expirationTime = timestamps.get(userId) + cooldownAmount;
            if (Date.now() < expirationTime) {
                msg = await message.reply((0, markdownToHtml_1.default)(`**⚠ شما به دلیل اسپم ممنوع شدید!**\nبدلیل اسپم از دستور **/${command.data.name}** به مدت \`🕓 ${cooldownDuration} ثانیه\` ممنوع شدید!\n لطفا پس از اتمام زمان دوباره تلاش کنید.`), { reply_parameters: { message_id: message.msgId }, parse_mode: "HTML" });
                return true;
            }
        }
        timestamps.set(userId, Date.now());
        setTimeout(async () => {
            timestamps.delete(userId);
            try {
                if (msg && msg.text) {
                    await __1.default.telegram.deleteMessage(message.chat.id, message.msgId);
                    await __1.default.telegram.deleteMessage(message.chat.id, msg.message_id);
                }
            }
            catch { }
        }, cooldownAmount);
        return false;
    }
    catch (e) {
        (0, error_1.default)(e);
    }
}
/**
 * @copyright
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */ 
//# sourceMappingURL=checkCmdCooldown.js.map