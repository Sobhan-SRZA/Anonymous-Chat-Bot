import { NarrowedContext } from "telegraf";
import { MyContext } from "../types/MessageContext";
import { Message, Update } from "telegraf/typings/core/types/typegram";
import EventType from "../types/EventType";
import error from "../utils/error";

const event: EventType = {
  name: "edited_message",
  run: async (client, ctx: NarrowedContext<MyContext, Update.MessageReactionUpdate>) => {
    try {
      console.log(ctx);
      const
        userId = ctx.from!.id,
        editedMsg = ctx.editedMessage! as Message.TextMessage;

      if (!editedMsg)
        return;

      const originalMsgId = editedMsg.message_id;
      if (!userId)
        return;

      const partnerId = await client.activeChats.get(`${userId}`);
      if (!partnerId)
        return;

      const
        mappingKey = `${userId}.${partnerId}`,
        mappings = await client.chatMessages.get(mappingKey);

      if (!mappings)
        return;

      let forwardedMsgId = mappings.find(a => a[0] === originalMsgId);
      if (!forwardedMsgId)
        return;

      try {
        if (editedMsg.text)
          await ctx.telegram.editMessageText(
            partnerId,
            forwardedMsgId[1],
            undefined,
            editedMsg.text
          );

      } catch (e) {
        console.error("خطا در ویرایش پیام در چت شریک:", e);
      }
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