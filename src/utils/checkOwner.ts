import { Context, NarrowedContext } from "telegraf";
import { Message, Update } from "telegraf/typings/core/types/typegram";
import client from "../..";
import error from "./error";

export default async function checkOwner(
  message: NarrowedContext<Context<Update>, Update.MessageUpdate<Message>>
): Promise<boolean | void> {
  try {
    if (!client.config.bot.support.owners.includes(message.from.id))
      return true;

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