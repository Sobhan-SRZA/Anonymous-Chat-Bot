import { MyContext } from "../types/MessageContext";
import { message } from "telegraf/filters";
import { Scenes } from "telegraf";
import forwardMessageToPartner from "./forwardMessageToPartner";
import getOrCreateReferralCode from "./getOrCreateReferralCode";
import updateUserLastSeen from "./updateUserLastSeen";
import checkUserIsBlock from "./checkUserIsBlock";
import setUserProfile from "./setUserProfile";
import getUserProfile from "./getUserProfile";
import markdownToHtml from "../functions/markdownToHtml";
import getUserData from "./getUserData";
import client from "../..";

const
  stages: Scenes.BaseScene<MyContext>[] = [],

  // Edit message
  edit_message = new Scenes.BaseScene<MyContext>("edit_message")
    .enter()
    .on(message("text"), async ctx => {
      const
        userId = ctx.from!.id,
        lastMessage = ctx.session.__scenes!.lastMessage!.get(client.botInfo!.id)!,
        messageId = lastMessage.to!,
        partnerId = (await client.activeChats.get(`${userId}`))!,
        leaveScene = async () => {
          ctx.session.__scenes!.lastMessage!.delete(client.botInfo!.id)
          await ctx.scene.leave()
          return;
        };

      setTimeout(async () => {
        if (!ctx.session.__scenes!.lastMessage?.has(client.botInfo!.id))
          return;

        await client.telegram.editMessageText(
          lastMessage.chat.id,
          lastMessage.message_id,
          undefined,
          "زمان شما به اتمام رسید."
        )
        return await leaveScene();
      }, 5 * 60 * 1000);

      await client.telegram.editMessageText(
        partnerId,
        messageId,
        undefined,
        markdownToHtml(ctx.text!),
        {
          parse_mode: "HTML"
        }
      )
      await client.telegram.editMessageText(
        lastMessage.chat.id,
        lastMessage.message_id,
        undefined,
        markdownToHtml("پیغام شما ویرایش شد ✅"),
        {
          parse_mode: "HTML"
        }
      );
      return await leaveScene();
    }),

  // Continue or answer to chat 
  continue_or_answer_chat = new Scenes.BaseScene<MyContext>("continue_or_answer_chat")
    .enter()
    .on(message("text"), async ctx => {
      const
        userId = ctx.from!.id,
        lastMessage = ctx.session.__scenes!.lastMessage!.get(client.botInfo!.id)!,
        partnerId = lastMessage.to!,
        forwardedMessage = (await forwardMessageToPartner(ctx, partnerId))!,
        leaveScene = async () => {
          ctx.session.__scenes!.lastMessage!.delete(client.botInfo!.id)
          await ctx.scene.leave()
          return;
        };

      setTimeout(async () => {
        if (!ctx.session.__scenes!.lastMessage?.has(client.botInfo!.id))
          return;

        await client.telegram.editMessageText(
          lastMessage.chat.id,
          lastMessage.message_id,
          undefined,
          "زمان شما به اتمام رسید."
        )
        return await leaveScene();
      }, 5 * 60 * 1000);

      await client.chatMessages.push(`${userId}.${partnerId}`, [
        { message_id: ctx.msgId, control_message_id: forwardedMessage?.control_message_id },
        { message_id: forwardedMessage?.message_id, reply_markup: forwardedMessage?.reply_markup }
      ]);
      await client.telegram.editMessageText(
        lastMessage.chat.id,
        lastMessage.message_id,
        undefined,
        markdownToHtml("پیغام شما ارسال شد ✅"),
        {
          parse_mode: "HTML"
        }
      );
      return await leaveScene();
    }),

  // Change welcome message 
  change_welcome_message = new Scenes.BaseScene<MyContext>("change_welcome_message")
    .enter()
    .on(message("text"), async ctx => {
      const
        db = client.db!,
        userId = ctx.from!.id,
        lastMessage = ctx.session.__scenes!.lastMessage!.get(client.botInfo!.id)!,
        profile = await getUserProfile(db, userId) || {},
        leaveScene = async () => {
          ctx.session.__scenes!.lastMessage!.delete(client.botInfo!.id)
          await ctx.scene.leave()
          return;
        };

      setTimeout(async () => {
        if (!ctx.session.__scenes!.lastMessage?.has(client.botInfo!.id))
          return;

        await client.telegram.editMessageText(
          lastMessage.chat.id,
          lastMessage.message_id,
          undefined,
          "زمان شما به اتمام رسید."
        )
        return await leaveScene();
      }, 5 * 60 * 1000);

      // Set last activity
      await updateUserLastSeen(db, userId);

      profile.welcome_message = ctx.text;
      await setUserProfile(db, userId, profile);
      await client.telegram.editMessageText(
        lastMessage.chat.id,
        lastMessage.message_id,
        undefined,
        markdownToHtml(`پیغام خوش آمد گویی شما با موفقیت تغییر یافت✔\nپیغام خوش آمد گویی شما:\`\`\`\n${profile.welcome_message}\n\`\`\``),
        {
          parse_mode: "HTML",
          reply_markup: {
            inline_keyboard: [
              [
                { text: "حذف 🗑", callback_data: "delete_welcome_message" },
                { text: "بازگشت ↩", callback_data: "setting" }
              ]
            ]
          }
        }
      );
      return await leaveScene();
    }),

  // Change nickname 
  change_nickname = new Scenes.BaseScene<MyContext>("change_nickname")
    .enter()
    .on(message("text"), async ctx => {
      const
        db = client.db!,
        userId = ctx.from!.id,
        lastMessage = ctx.session.__scenes!.lastMessage!.get(client.botInfo!.id)!,
        profile = await getUserProfile(db, userId) || {},
        leaveScene = async () => {
          ctx.session.__scenes!.lastMessage!.delete(client.botInfo!.id)
          await ctx.scene.leave()
          return;
        };

      setTimeout(async () => {
        if (!ctx.session.__scenes!.lastMessage?.has(client.botInfo!.id))
          return;

        await client.telegram.editMessageText(
          lastMessage.chat.id,
          lastMessage.message_id,
          undefined,
          "زمان شما به اتمام رسید."
        )
        return await leaveScene();
      }, 5 * 60 * 1000);

      profile.nickname = ctx.text;
      await setUserProfile(db, userId, profile);
      await client.telegram.editMessageText(
        lastMessage.chat.id,
        lastMessage.message_id,
        undefined,
        markdownToHtml(`نام نمایشی شما با موفقیت تغییر یافت✔\nنام نمایشی شما:\`\`\`\n${profile.nickname}\n\`\`\``),
        {
          parse_mode: "HTML",
          reply_markup: {
            inline_keyboard: [
              [
                { text: "حذف 🗑", callback_data: "delete_nickname" },
                { text: "بازگشت ↩", callback_data: "setting" }
              ]
            ]
          }
        }
      );
      return await leaveScene();
    }),

  // Found user 
  found_user = new Scenes.BaseScene<MyContext>("found_user")
    .enter()
    .on(message("text"), async ctx => {
      const
        db = client.db!,
        forwarded = ctx.message.forward_origin as any,
        lastMessage = ctx.session.__scenes!.lastMessage!.get(client.botInfo!.id)!,
        leaveScene = async () => {
          ctx.session.__scenes!.lastMessage!.delete(client.botInfo!.id)
          await ctx.scene.leave()
          return;
        };

      setTimeout(async () => {
        if (!ctx.session.__scenes!.lastMessage?.has(client.botInfo!.id))
          return;

        await client.telegram.editMessageText(
          lastMessage.chat.id,
          lastMessage.message_id,
          undefined,
          "زمان شما به اتمام رسید."
        )
        return await leaveScene();
      }, 5 * 60 * 1000);

      let userId: number | null = null;
      if (forwarded) {
        if (forwarded?.type === "hidden_user") {
          const userData = getUserData(client, { name: forwarded?.sender_user_name });
          if (!userData) {
            await client.telegram.editMessageText(
              lastMessage.chat.id,
              lastMessage.message_id,
              undefined,
              "اطلاعات کاربر یافت نشد."
            )
            return await leaveScene();
          }
        }

        userId = forwarded?.sender_user.id;
      }

      else {
        const
          text = ctx.text.trim(),
          userLinkMatch = text.match(/t\.me\/([A-Za-z0-9_]+)/),
          userIdMatch = text.match(/^(\d{5,})$/),
          usernameMatch = text.match(/@([A-Za-z0-9_]+)/),
          userData = getUserData(client, {
            username: usernameMatch ? usernameMatch![1] : userLinkMatch![1],
            id: parseInt(userIdMatch![1])
          });

        if (!userData) {
          await client.telegram.editMessageText(
            lastMessage.chat.id,
            lastMessage.message_id,
            undefined,
            "اطلاعات کاربر یافت نشد."
          )
          return await leaveScene();
        }

        userId = userData.id!;
      }

      const userProfile = await getUserProfile(db, userId!);
      if (userId && userProfile) {
        const
          userReferralCode = await getOrCreateReferralCode(db, userId),
          getUserBlocks = await client.blocks.get(`${ctx.from.id}`),
          getPartnerBlocks = await client.blocks.get(`${userId}`);

        if (getUserBlocks && getUserBlocks.some(a => a.id === userId)) {
          await ctx.answerCbQuery("ارسال ناموفق | کاربر توسط شما مسدود است.");
          return await leaveScene();
        }

        else if (getPartnerBlocks && getPartnerBlocks.some(a => a.id === ctx.from.id)) {
          await ctx.answerCbQuery("ارسال ناموفق | شما توسط کاربر مسدود هستید.");
          return await leaveScene();
        }

        if (await checkUserIsBlock(
          client,
          ctx,
          ctx.from.id,
          userId,
          async () => await client.telegram.editMessageText(
            lastMessage.chat.id,
            lastMessage.message_id,
            undefined,
            markdownToHtml("کاربر مالک این کد قبلا توسط شما مسدود شده است.\n```\n**برای خارج سازی از مسدودی، از دستور /settings استفاده کنید!**\n```"),
            {
              parse_mode: "HTML"
            }
          ),
          async () => await client.telegram.editMessageText(
            lastMessage.chat.id,
            lastMessage.message_id,
            undefined,
            "شما توسط کاربر مسدود هستید و به همین دلیل نمیتوانید لینک او را دریافت کنید!"
          )
        ))
          return await leaveScene();

        await client.telegram.editMessageText(
          lastMessage.chat.id,
          lastMessage.message_id,
          undefined,
          markdownToHtml(`👤 لینک ناشناس **${userProfile.nickname || `User_${userReferralCode}`}**\n\n🔗 https://t.me/${encodeURIComponent(client.botInfo!.username)}?start=${encodeURIComponent(userReferralCode)}`),
          {
            parse_mode: "HTML"
          }
        )
        return await leaveScene();
      }

      else if (userId && !userProfile) {
        await client.telegram.editMessageText(
          lastMessage.chat.id,
          lastMessage.message_id,
          undefined,
          "کاربر در ربات پروفایلی ندارد!"
        )
        return await leaveScene();
      }

      else {
        await client.telegram.editMessageText(
          lastMessage.chat.id,
          lastMessage.message_id,
          undefined,
          "کاربری با اطلاعاتی که وارد کردید یافت نشد دوباره تلاش کنید!"
        )
        return await leaveScene();
      }
    });

stages.push(edit_message);
stages.push(continue_or_answer_chat);
stages.push(change_welcome_message);
stages.push(change_nickname);
stages.push(found_user);
export default stages;
/**
 * @copyright
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */