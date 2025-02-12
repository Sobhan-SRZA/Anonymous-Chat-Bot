import { UserData } from "../types/UserProfile";
import TelegramClient from "../classes/Client";

export default async function getUserData(client: TelegramClient, data: UserData) {
  const allUsers = await client.users.all();
  const findUser = allUsers.find(
    a =>
      a.value.id === data.id ||
      a.value.name === data.name ||
      a.value.username === data.username?.toLowerCase()
  );

  return findUser?.value || null
}
/**
 * @copyright
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */