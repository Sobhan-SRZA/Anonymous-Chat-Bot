import { Context, NarrowedContext } from "telegraf";
import { Message, Update } from "telegraf/typings/core/types/typegram";
import error from "./error";
import escapeMarkdown from "../functions/escapeMarkdown";

export default async function checkMember(
  message: NarrowedContext<Context<Update>, Update.MessageUpdate<Message>>
): Promise<boolean | void> {
  try {
    if (message.chat.type !== "group") {
      await message.replyWithMarkdownV2(escapeMarkdown(`**⚠ خطا!**\nاین دستور فقط در گروه ها یا چنل ها قابل استفاده است!`));
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