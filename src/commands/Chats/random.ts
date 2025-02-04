import CommandType from "../../types/command";
import cleanupUser from "../../utils/cleanupUser";
import error from "../../utils/error";
import getUserProfile from "../../utils/getUserProfile";

const command: CommandType = {
  data: {
    name: "random",
    description: "ورود به صف انتظار چت تصادفی با فیلتر جنسیتی (در صورت ارسال پارامتر)"
  },
  category: "chats",
  cooldown: 5,
  only_privet: true,
  run: async (client, ctx, args) => {
    try {
      const
        db = client.db!,
        userId = ctx.from?.id;

      if (!userId)
        return;

      if (client.activeChats.has(userId))
        return await ctx.reply("شما در حال حاضر در یک چت فعال هستید. برای قطع ارتباط از /stop استفاده کنید.");

      let targetGender: string | null = null;
      if (args.length > 0) {
        targetGender = args[0].toLowerCase();
        if (!["male", "female", "other"].includes(targetGender))
          return await ctx.reply("جنسیت نامعتبر است. از میان male, female یا other انتخاب کنید.");

      }

      else {
        const profile = await getUserProfile(db, userId);
        if (profile) 
          targetGender = profile.gender;

        else
          return await ctx.reply("لطفاً ابتدا با دستور /setprofile پروفایل خود را تنظیم کنید یا از /anon برای چت عمومی استفاده نمایید.");

      }

      if (client.randomQueues[targetGender].includes(userId))
        return await ctx.reply("شما قبلاً در صف انتظار چت تصادفی با این جنسیت قرار گرفته‌اید، لطفاً کمی صبر کنید...");

      if (client.randomQueues[targetGender].length > 0) {
        const partnerId = client.randomQueues[targetGender].shift()!;
        client.activeChats.set(userId, partnerId);
        client.activeChats.set(partnerId, userId);
        await ctx.reply("شما با یک کاربر ناشناس جفت شدید! اکنون می‌توانید پیام‌هایتان را رد و بدل کنید.");
        try {
          await client.telegram.sendMessage(
            partnerId,
            "شما با یک کاربر ناشناس جفت شدید! اکنون می‌توانید پیام‌هایتان را رد و بدل کنید."
          );
        } catch {
          await ctx.reply("متاسفانه پیام به کاربر مقابل ارسال نشد.");
          await cleanupUser(client, userId);
        }
      }

      else {
        client.randomQueues[targetGender].push(userId);
        return await ctx.reply(`در انتظار یافتن شریک چت (${targetGender}) هستیم...`);
      }
    } catch (e: any) {
      error(e)
    }
  }
};
export default command;
/**
 * @copyright
 * Coded by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * @copyright
 * Work for Persian Caesar | https://dsc.gg/persian-caesar
 * @copyright
 * Please Mention Us "Persian Caesar", When Have Problem With Using This Code!
 * @copyright
 */