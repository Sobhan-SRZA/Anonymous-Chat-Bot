import CommandType from "../../types/command";
import cleanupUser from "../../utils/cleanupUser";
import error from "../../utils/error";

const command: CommandType = {
  data: {
    name: "anon",
    description: "ورود به صف انتظار چت ناشناس عمومی (بدون فیلتر جنسیتی)"
  },
  category: "chats",
  cooldown: 5,
  only_privet: true,
  run: async (client, ctx) => {
    try {
      const userId = ctx.from?.id;
      if (!userId)
        return;

      if (client.activeChats.has(userId))
        return await ctx.reply("شما در حال حاضر در یک چت فعال هستید. برای قطع ارتباط از /stop استفاده کنید.");


      if (client.anonQueue.includes(userId))
        return await ctx.reply("شما قبلاً در صف انتظار چت ناشناس قرار گرفته‌اید، لطفاً کمی صبر کنید...");

      if (client.anonQueue.length > 0) {
        const partnerId = client.anonQueue.shift()!;
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
          return await cleanupUser(client, userId);
        }
      }

      else {
        client.anonQueue.push(userId);
        return await ctx.reply("در انتظار یافتن شریک چت هستیم...");
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