import { Context } from "telegraf";
import error from "./error";
import post from "../functions/post";

export default async function forwardMessageToPartner(ctx: Context, partnerId: number) {
  try {
    return await ctx.telegram.copyMessage(partnerId, ctx.chat!.id, ctx.message!.message_id);
  } catch (e: any) {
    post("Error copying message:", "E", "red", "red")
    error(e);
    return await ctx.reply("خطایی در ارسال پیام به شریک چت رخ داد.");
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