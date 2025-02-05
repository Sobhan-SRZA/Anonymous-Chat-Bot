import error from "./error";
import TelegramClient from "../classes/Client";
import post from "../functions/post";

const randomQueues: { [gender: string]: number[] } = {
  male: [],
  female: [],
  other: []
};
export default async function cleanupUser(client: TelegramClient, userId: number) {
  let index = client.anonQueue.indexOf(userId);
  if (index > -1) 
    client.anonQueue.splice(index, 1);
  

  for (const gender in randomQueues) {
    index = randomQueues[gender].indexOf(userId);
    if (index > -1) 
      randomQueues[gender].splice(index, 1);
    
  }

  if (client.referralWaiting.has(userId)) 
    client.referralWaiting.delete(userId);

  if (client.activeChats.has(userId)) {
    const partnerId = client.activeChats.get(userId)!;
    client.activeChats.delete(userId);
    client.activeChats.delete(partnerId);
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