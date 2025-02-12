import { lastMessageType, MyContext } from "../types/MessageContext";
import { Message, Update } from "telegraf/typings/core/types/typegram";

export default function setLastMessage(ctx: MyContext, msg: Update.Edited & Message.TextMessage | Message.TextMessage, data?: lastMessageType | null, to?: number) {
  if (data)
    return ctx.session.__scenes?.lastMessage?.set(msg.from!.id, data);

  return ctx.session.__scenes?.lastMessage?.set(msg.from!.id, {
    to,
    text: msg.text,
    message_id: msg.message_id,
    chat: {
      id: msg.chat.id,
      type: msg.chat.type
    },
    from: {
      id: msg.from!.id,
      username: msg.from!.username
    }
  });
}
/**
 * @copyright
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */