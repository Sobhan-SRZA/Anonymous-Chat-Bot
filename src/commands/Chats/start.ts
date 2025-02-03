import CommandType from "../../types/command";
import cleanupUser from "../../utils/cleanupUser";
import error from "../../utils/error";
import getUserIdByReferralCode from "../../utils/getUserIdByReferralCode";

const command: CommandType = {
  data: {
    name: "start",
    description: "شروع چت."
  },
  category: "chats",
  cooldown: 5,
  run: async (client, ctx) => {
    try {
      

      const userId = ctx.from?.id;
      if (!userId)
        return;

      await cleanupUser(client, userId);
      const args = ctx.text!.split(" ");
      if (args.length > 1) {
        const param = args[0];
        if (!param)
          return;

        const
          db = client.db!,
          referrerId = await getUserIdByReferralCode(db, param);

        if (referrerId === null)
          return await ctx.reply('لینک referral معتبر نیست.');

        if (referrerId === userId)
          return await ctx.reply('شما نمی‌توانید از لینک خودتان استفاده کنید.');

        if (client.referralWaiting.has(referrerId)) {
          client.activeChats.set(userId, referrerId);
          client.activeChats.set(referrerId, userId);
          client.referralWaiting.delete(referrerId);
          await ctx.reply("شما با کاربری ناشناس جفت شدید!");
          try {
            return await client.telegram.sendMessage(
              referrerId,
              "شما با یک کاربر ناشناس از طریق لینک جفت شدید! اکنون می‌توانید پیام‌هایتان را رد و بدل کنید."
            );
          } catch (err) {
            await ctx.reply("متاسفانه پیام به کاربر مقابل ارسال نشد.");
            return await cleanupUser(client, userId);
          }
        }

        else
          return await ctx.reply("لینک منقضی شده یا کاربر مرجع در حالت انتظار نیست.");

      }

      return await ctx.reply("برای شروع چت ناشناس از دستور /anon یا /random استفاده کنید.");
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