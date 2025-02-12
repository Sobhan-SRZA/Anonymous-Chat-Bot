import { UserData } from "../types/UserProfile";
import TelegramClient from "../classes/Client";

export default function getUserData(client: TelegramClient, data: UserData): UserData | null {
  const findUser = client.users.find(
    a =>
      a.id === data.id ||
      a.name === data.name ||
      a.username === data.username
  );

  return findUser || null
}
/**
 * @copyright
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */