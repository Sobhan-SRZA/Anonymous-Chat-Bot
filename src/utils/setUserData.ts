import { UserData } from "../types/UserProfile";
import TelegramClient from "../classes/Client";

export default async function setUserData(client: TelegramClient, data: UserData) {
  return await client.users.set(`${data.id}`, data);
}
/**
 * @copyright
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */