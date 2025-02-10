import TelegramClient from "../classes/Client";

export default async function getUserIdByUsername(client: TelegramClient, username: string): Promise<number | null> {
  try {
    const user = await client.telegram.getChat(`@${username}`);
    if (!user || !user.id)
      return null;

    return user.id || null;
  } catch {
    return null
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