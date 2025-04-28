import { getToggleButton, PermissionNames, permissionsMapping } from "../../types/UserProfile";
import setUserProfile from "../../utils/setUserProfile";
import getUserProfile from "../../utils/getUserProfile";
import CommandType from "../../types/command";
import error from "../../utils/error";

const command: CommandType = {
  data: {
    name: "settings",
    description: "تنظیمات شما در ربات."
  },
  category: "chats",
  cooldown: 2,
  only_privet: true,
  run: async (client, ctx) => {
    try {
      const
        db = client.db!,
        userId = ctx.from.id,
        profile = await getUserProfile(db, userId) || {}, inline_keyboard: { text: string; callback_data: string }[][] = [];

      if (!profile.permissions) {

        // Default permissions 
        profile.permissions = {
          found_user_link: true,
          random_chat: true,
          send_circule_video: true,
          send_file: true,
          send_gif: true,
          send_image: true,
          send_music: true,
          send_sticker: true,
          send_text: true,
          send_video: true,
          send_voice: true
        };

        await setUserProfile(client, { id: userId, name: ctx.from.first_name, username: ctx.from.username?.toLowerCase() }, profile);
      }

      inline_keyboard.push([{ text: "تغییر نام نمایشی 👤", callback_data: "change_nickname" }]);
      inline_keyboard.push([{ text: "پیام خوش آمدگویی 👋🏻", callback_data: "change_welcome_message" }]);
      for (const permissionKey in permissionsMapping) {
        const
          key = permissionKey as PermissionNames,
          mapping = permissionsMapping[key],
          isEnabled = !!profile.permissions[key];

        inline_keyboard.push([
          getToggleButton(key, isEnabled),
          { text: mapping.label, callback_data: mapping.infoCallback },
        ]);
      }

      inline_keyboard.push([{ text: "مسدودی ها ⛔", callback_data: "blocked_list" }]);
      inline_keyboard.push([{ text: "بازگشت ↩", callback_data: "return_start" }]);

      return await ctx.reply("تنظیمات:", {
        reply_markup: { inline_keyboard },
        reply_parameters: {
          message_id: ctx.msgId
        }
      });
    } catch (e: any) {
      error(e)
    }
  }
};

export default command;
/**
 * @copyright
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */