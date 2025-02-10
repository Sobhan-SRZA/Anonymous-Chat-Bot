import { InlineKeyboardMarkup } from "telegraf/typings/core/types/typegram";

const startMessageButtons: InlineKeyboardMarkup | undefined = {
  inline_keyboard: [
    [
      { text: "چت با ناشناس 📞", callback_data: "anonymous_chat" },
      { text: "لینک ناشناس من 🔗", callback_data: "my_referral_link" }
    ],
    [
      { text: "پشتیبانی ⚒", url: "https://t.me/Sobhan_SRZA" }
    ],
    [
      { text: "لینک یاب 🔍", callback_data: "found_user" },
      { text: "راهنما 💡", callback_data: "faq" }
    ],
    [
      { text: "تنظیمات ⚙", callback_data: "setting" }
    ]
  ]
};

export { startMessageButtons };
/**
 * @copyright
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */