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
        return await ctx.reply(
          "شما در حال حاضر در یک چت فعال هستید. برای قطع ارتباط از /stop استفاده کنید.",
          { reply_parameters: { message_id: ctx.msgId } }
        );

      let targetGender: string | null = null;
      if (args.length > 0) {
        targetGender = args[0].toLowerCase();
        if (!["male", "female", "other"].includes(targetGender))
          return await ctx.reply(
            "جنسیت نامعتبر است. از میان male, female یا other انتخاب کنید.",
            { reply_parameters: { message_id: ctx.msgId } }
          );

      }

      else {
        const profile = await getUserProfile(db, userId);
        if (profile && profile.gender)
          targetGender = profile.gender;

        else
          return await ctx.reply(
            "لطفاً ابتدا با دستور /setprofile پروفایل خود را تنظیم کنید یا از /anon برای چت عمومی استفاده نمایید.",
            { reply_parameters: { message_id: ctx.msgId } }
          );

      }

      if (client.randomQueues[targetGender].includes(userId))
        return await ctx.reply(
          "شما قبلاً در صف انتظار چت تصادفی با این جنسیت قرار گرفته‌اید، لطفاً کمی صبر کنید...",
          { reply_parameters: { message_id: ctx.msgId } }
        );

      if (client.randomQueues[targetGender].length > 0) {
        const partnerId = client.randomQueues[targetGender].shift()!;
        client.activeChats.set(userId, partnerId);
        client.activeChats.set(partnerId, userId);
        await ctx.reply(
          "شما با یک کاربر ناشناس جفت شدید! اکنون می‌توانید پیام‌هایتان را رد و بدل کنید.",
          { reply_parameters: { message_id: ctx.msgId } }
        );
        try {
          await client.telegram.sendMessage(
            partnerId,
            "شما با یک کاربر ناشناس جفت شدید! اکنون می‌توانید پیام‌هایتان را رد و بدل کنید."
          );
        } catch {
          await ctx.reply(
            "متاسفانه پیام به کاربر مقابل ارسال نشد.",
            { reply_parameters: { message_id: ctx.msgId } }
          );
          await cleanupUser(client, userId);
        }
      }

      else {
        client.randomQueues[targetGender].push(userId);
        return await ctx.reply(
          `در انتظار یافتن شریک چت (${targetGender}) هستیم...`,
          { reply_parameters: { message_id: ctx.msgId } }
        );
      }
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