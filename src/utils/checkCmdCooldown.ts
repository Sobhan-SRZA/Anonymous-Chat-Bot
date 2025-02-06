import { Context, NarrowedContext } from "telegraf";
import { Message, Update } from "telegraf/typings/core/types/typegram";
import { Collection } from "../classes/Collection";
import markdownToHtml from "../functions/markdownToHtml";
import CommandType from "../types/command";
import client from "../..";
import error from "./error";

export default async function checkCmdCooldown(
  message: NarrowedContext<Context<Update>, Update.MessageUpdate<Message>>,
  command: CommandType
): Promise<boolean | void> {
  try {
    const userId = message.from.id;
    if (!client.cooldowns.has(command.data.name))
      client.cooldowns.set(command.data.name, new Collection());

    const
      timestamps = client.cooldowns.get(command.data.name)!,
      cooldownDuration = (command.cooldown ?? 3),
      cooldownAmount = cooldownDuration * 1000;

    let msg: Message.TextMessage;
    if (timestamps.has(userId)) {
      const expirationTime = timestamps.get(userId)! + cooldownAmount;
      if (Date.now() < expirationTime) {
        msg = await message.reply(
          markdownToHtml(`**⚠ شما به دلیل اسپم ممنوع شدید!**\nبدلیل اسپم از دستور **/${command.data.name}** به مدت \`🕓 ${cooldownDuration} ثانیه\` ممنوع شدید!\n لطفا پس از اتمام زمان دوباره تلاش کنید.`),
          { reply_parameters: { message_id: message.msgId }, parse_mode: "HTML" }
        )
        return true;
      }
    }

    timestamps.set(userId, Date.now());
    setTimeout(async () => {
      timestamps.delete(userId);
      try {
        if (msg && msg.text) {
          await client.telegram.deleteMessage(message.chat.id, message.msgId);
          await client.telegram.deleteMessage(message.chat.id, msg.message_id);
        }
        
      } catch { }
    }, cooldownAmount);

    return false;
  } catch (e: any) {
    error(e);
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