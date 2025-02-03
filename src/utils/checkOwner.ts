import { Context, NarrowedContext } from "telegraf";
import { Message, Update } from "telegraf/typings/core/types/typegram";
import error from "./error";
import client from "../..";

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
 * Coded by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * @copyright
 * Work for Persian Caesar | https://dsc.gg/persian-caesar
 * @copyright
 * Please Mention Us "Persian Caesar", When Have Problem With Using This Code!
 * @copyright
 */