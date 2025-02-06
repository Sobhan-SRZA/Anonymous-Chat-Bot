import { UserPermissionDescriptions } from "../types/UserProfile";
import { Context } from "telegraf";
import getRequiredPermission from "./getRequiredPermission";
import getUserProfile from "./getUserProfile";
import client from "../..";
import error from "./error";
import post from "../functions/post";

export default async function forwardMessageToPartner(ctx: Context, partnerId: number) {
  try {
    const partnerProfile = await getUserProfile(client.db!, partnerId);
    if (partnerProfile && partnerProfile.permissions) {
      const requiredPermission = getRequiredPermission(ctx.message);
      if (requiredPermission)
        if (!partnerProfile.permissions[requiredPermission]) {
          const description = UserPermissionDescriptions[requiredPermission];
          return await ctx.reply(`شریک چت اجازه ${description} را ندارد.`);
        }

    }

    return await ctx.telegram.copyMessage(partnerId, ctx.chat!.id, ctx.message!.message_id);
  } catch (e: any) {
    post("Error copying message:", "E", "red", "red")
    error(e);

    return await ctx.reply("خطایی در ارسال پیام به شریک چت رخ داد.");
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