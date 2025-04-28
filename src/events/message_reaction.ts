import { NarrowedContext } from "telegraf";
import { MyContext } from "../types/MessageContext";
import { Update } from "telegraf/typings/core/types/typegram";
import checkUserIsBlock from "../utils/checkUserIsBlock";
import EventType from "../types/EventType";
import error from "../utils/error";

const event: EventType = {
  name: "message_reaction",
  run: async (client, ctx: NarrowedContext<MyContext, Update.MessageReactionUpdate>) => {
    try {
      const
      reactionData = ctx.update?.message_reaction,
      userId = reactionData?.user?.id,
        originalMsgId = reactionData?.message_id,
        partnerId = await client.activeChats!.get(`${userId}`),
        mappingKey = `${userId}.${partnerId}`,
        mappings = await client.chatMessages!.get(mappingKey),
        forwardedMsgId = mappings?.find(a => a[0].message_id === originalMsgId);

      if (!userId || !reactionData || !partnerId || !mappings || !forwardedMsgId)
        return;

      if (await checkUserIsBlock(
        client.blocks!,
        ctx,
        userId,
        partnerId,
      ))
        return;

      try {
        await ctx.telegram.setMessageReaction(
          partnerId,
          forwardedMsgId[1].message_id,
          reactionData.new_reaction
        );
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