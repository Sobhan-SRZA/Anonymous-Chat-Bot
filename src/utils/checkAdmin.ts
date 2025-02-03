import { Context, NarrowedContext } from "telegraf";
import { Message, Update } from "telegraf/typings/core/types/typegram";
import error from "./error";
import escapeMarkdown from "../functions/escapeMarkdown";

export default async function checkAdmin(
  message: NarrowedContext<Context<Update>, Update.MessageUpdate<Message>>
): Promise<boolean | void> {
  try {
    const admins = await message.getChatAdministrators();
    if (!admins.some(a => a.user.id === message.from.id)) {
      await message.replyWithMarkdownV2(escapeMarkdown(`**⚠ خطا!**\nاین دستور فقط برای ادمین ها قابل استفاده است!`));
      return true;
    }

    return false;
  } catch (e: any) {
    error(e);
  }
}
/**
 * @copyright
 * Coded by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * @copyright
 * Work for Persian Caesar | https://dsc.gg/persian-caesar
 * @copyright
 * Please Mention Us "Persian Caesar", When Have Problem With Using This Code!
 * @copyright
 */