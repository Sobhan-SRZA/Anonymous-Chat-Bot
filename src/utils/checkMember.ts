import { Context, NarrowedContext } from "telegraf";
import { Message, Update } from "telegraf/typings/core/types/typegram";
import markdownToHtml from "../functions/markdownToHtml";
import error from "./error";

export default async function checkMember(
  message: NarrowedContext<Context<Update>, Update.MessageUpdate<Message>>
): Promise<boolean | void> {
  try {
    if (message.chat.type !== "group") {
      await message.reply(
        markdownToHtml(`**⚠ خطا!**\nاین دستور فقط در گروه ها یا چنل ها قابل استفاده است!`),
        { reply_parameters: { message_id: message.msgId }, parse_mode: "HTML" }
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