import { NarrowedContext } from "telegraf";
import { Message, Update } from "telegraf/typings/core/types/typegram";
import { MyContext } from "../types/MessageContext";
import forwardMessageToPartner from "../utils/forwardMessageToPartner";
import updateUserLastSeen from "../utils/updateUserLastSeen";
import checkCmdCooldown from "../utils/checkCmdCooldown";
import checkMember from "../utils/checkMember";
import checkAdmin from "../utils/checkAdmin";
import checkOwner from "../utils/checkOwner";
import EventType from "../types/EventType";
import error from "../utils/error";

const event: EventType = {
  name: "message",
  run: async (client, message: NarrowedContext<MyContext, Update.MessageUpdate<Message>>) => {
    try {
      const
        db = client.db!,
        userId = message.from!.id;

      // Filter the bots
      if (message.from.is_bot)
        return;

      // Filter Commands
      if (message.text && message.text.startsWith("/")) {

        // Set last activity
        await updateUserLastSeen(db, userId);

        const
          args = message.text.slice(1).trim().split(/ +/g),
          mention = `@${client.botInfo?.username}`;

        let commandName = args.shift()!.toLowerCase();

        // Filter Other Bots Commands In Groups 
        if (message.chat.type !== "private")
          if (!commandName.includes(mention))
            return;


        commandName = commandName.replace(mention, "");
        const command =
          client.commands.get(commandName) ||
          client.commands.find(a => a.aliases! && a.aliases.includes(commandName))!;

        // Filter Only Valid Commands
        if (!command && message.chat.type === "private")
          return await message.sendMessage("⚠دستور تعریف نشده!");

        // Filter Privet Commands
        if (command.only_privet && message.chat.type !== "private")
          return;

        // Filter Group Commands
        if (command.only_group && await checkMember(message))
          return;

        // Filter Admins
        if (command.only_admins && await checkAdmin(message))
          return;

        // Filter Owner
        if (command.only_owner && await checkOwner(message))
          return;

        // Cooldown
        if (await checkCmdCooldown(message, command))
          return;

        // Command Handler
        await db.add("totalCommandsUsed", 1);
        return await command.run(client, message, args);
      }

      // Chat forwarding
      const
        partnerId = await client.activeChats.get(`${userId}`),
        chatMessages = await client.chatMessages.get(`${userId}.${partnerId}`);

      if (partnerId && !chatMessages) {
        const forwardedMessage = await forwardMessageToPartner(message, partnerId);
        await client.chatMessages.push(`${userId}.${partnerId}`, [message.msgId, forwardedMessage.message_id]);
        return;
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