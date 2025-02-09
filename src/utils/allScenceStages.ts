import { message } from "telegraf/filters";
import { MyContext } from "../types/MessageContext";
import { Scenes } from "telegraf";
import forwardMessageToPartner from "./forwardMessageToPartner";
import markdownToHtml from "../functions/markdownToHtml";
import client from "../..";
import getUserProfile from "./getUserProfile";
import updateUserLastSeen from "./updateUserLastSeen";
import setUserProfile from "./setUserProfile";

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
        partnerId = (await client.activeChats.get(`${userId}`))!;

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
      )
      ctx.session.__scenes!.lastMessage!.delete(client.botInfo!.id)
      const msg = await ctx.reply("پیامتان دریافت شد.", {
        reply_parameters: { message_id: ctx.msgId }
      });
      setTimeout(async () => await client.telegram.deleteMessage(ctx.chat.id, msg.message_id), 5 * 1000);
      return await ctx.scene.leave();
    }),

  // Continue or answer to chat 
  continue_or_answer_chat = new Scenes.BaseScene<MyContext>("continue_or_answer_chat")
    .enter()
    .on(message("text"), async ctx => {
      const
        userId = ctx.from!.id,
        lastMessage = ctx.session.__scenes!.lastMessage!.get(client.botInfo!.id)!,
        partnerId = lastMessage.to!,
        forwardedMessage = await forwardMessageToPartner(ctx, partnerId);

      await client.chatMessages.push(`${userId}.${partnerId}`, [ctx.msgId, forwardedMessage.message_id]);
      await client.telegram.editMessageText(
        lastMessage.chat.id,
        lastMessage.message_id,
        undefined,
        markdownToHtml("پیغام شما ارسال شد ✅"),
        {
          parse_mode: "HTML"
        }
      )
      ctx.session.__scenes!.lastMessage!.delete(client.botInfo!.id)
      const msg = await ctx.reply("پیامتان دریافت شد.", {
        reply_parameters: { message_id: ctx.msgId }
      });
      setTimeout(async () => await client.telegram.deleteMessage(ctx.chat.id, msg.message_id), 5 * 1000);
      return await ctx.scene.leave();
    }),

  // Change welcome message 
  change_welcome_message = new Scenes.BaseScene<MyContext>("change_welcome_message")
    .enter()
    .on(message("text"), async ctx => {
      const
        db = client.db!,
        userId = ctx.from!.id,
        lastMessage = ctx.session.__scenes!.lastMessage!.get(client.botInfo!.id)!,
        profile = await getUserProfile(db, userId) || {};

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
      )
      ctx.session.__scenes!.lastMessage!.delete(client.botInfo!.id)
      const msg = await ctx.reply("پیامتان دریافت شد.", {
        reply_parameters: { message_id: ctx.msgId }
      });
      setTimeout(async () => await client.telegram.deleteMessage(ctx.chat.id, msg.message_id), 5 * 1000);
      return await ctx.scene.leave();
    }),

  // Change nickname 
  change_nickname = new Scenes.BaseScene<MyContext>("change_nickname")
    .enter()
    .on(message("text"), async ctx => {
      const
        db = client.db!,
        userId = ctx.from!.id,
        lastMessage = ctx.session.__scenes!.lastMessage!.get(client.botInfo!.id)!,
        profile = await getUserProfile(db, userId) || {};

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
      )
      ctx.session.__scenes!.lastMessage!.delete(client.botInfo!.id)
      const msg = await ctx.reply("پیامتان دریافت شد.", {
        reply_parameters: { message_id: ctx.msgId }
      });
      setTimeout(async () => await client.telegram.deleteMessage(ctx.chat.id, msg.message_id), 5 * 1000);
      return await ctx.scene.leave();
    });

stages.push(edit_message);
stages.push(continue_or_answer_chat);
stages.push(change_welcome_message);
stages.push(change_nickname);
export default stages;
/**
 * @copyright
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */