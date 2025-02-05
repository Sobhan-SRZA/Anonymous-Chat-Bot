import { Context, NarrowedContext } from "telegraf";
import { Message, Update } from "telegraf/typings/core/types/typegram";
import error from "./error";
import markdownToHtml from "../functions/markdownToHtml";

export default async function checkAdmin(
  message: NarrowedContext<Context<Update>, Update.MessageUpdate<Message>>
): Promise<boolean | void> {
  try {
    const admins = await message.getChatAdministrators();
    if (!admins.some(a => a.user.id === message.from.id)) {
      await message.reply(
        markdownToHtml(`**⚠ خطا!**\nاین دستور فقط برای ادمین ها قابل استفاده است!`),
        { reply_parameters: { message_id: message.msgId } }
      );
      return true;
    }

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