import { Message, Update } from "telegraf/typings/core/types/typegram";
import { NarrowedContext } from "telegraf";
import { MyContext } from "../types/MessageContext";
import checkUserIsBlock from "../utils/checkUserIsBlock";
import EventType from "../types/EventType";
import error from "../utils/error";

const event: EventType = {
  name: "edited_message",
  run: async (client, ctx: NarrowedContext<MyContext, Update.MessageReactionUpdate>) => {
    try {
      const
        userId = ctx.from!.id,
        editedMsg = ctx.editedMessage! as Message.TextMessage,
        originalMsgId = editedMsg.message_id,
        partnerId = await client.activeChats.get(`${userId}`),
        mappingKey = `${userId}.${partnerId}`,
        mappings = await client.chatMessages.get(mappingKey),
        forwardedMsgId = mappings?.find(a => a[0].message_id === originalMsgId);

      if (!userId || !editedMsg || !partnerId || !mappings || !forwardedMsgId)
        return;

      if (await checkUserIsBlock(
        client,
        ctx,
        userId,
        partnerId,
      ))
        return;

      try {
        if (editedMsg.text) {
          await ctx.telegram.editMessageText(
            partnerId,
            forwardedMsgId[1].message_id,
            undefined,
            editedMsg.text,
            {
              reply_markup: forwardedMsgId[1].reply_markup
            }
          );
        }

      } catch { }
    } catch (e: any) {
      error(e);
    }
  }
};

export default event;
/**
 * @copyright
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */