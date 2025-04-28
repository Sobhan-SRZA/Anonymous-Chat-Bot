import TelegramClient from "../classes/Client";
import error from "./error";
import post from "../functions/post";

export default async function cleanupUser(client: TelegramClient, userId: number) {
  if ((await client.activeChats!.has(`${userId}`))) {
    const partnerId = (await client.activeChats!.get(`${userId}`))!;
    await client.activeChats!.delete(`${userId}`);
    await client.activeChats!.delete(`${partnerId}`);
    try {
      return await client.telegram.sendMessage(
        partnerId,
        "شریک چت شما از چت خارج شد. برای شروع چت جدید، /start یا سایر دستورات را استفاده کنید."
      );
    } catch (err: any) {
      post("Error notifying partner on cleanup!", "E", "red", "red")
      error(err);
    }
  }
}
/**
 * @copyright
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */