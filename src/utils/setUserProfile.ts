import Profile, { UserData } from "../types/UserProfile";
import TelegramClient from "../classes/Client";
import setUserData from "./setUserData";

export default async function setUserProfile(client: TelegramClient, data: UserData, profile: Profile) {
  await setUserData(client, data);
  await client.db!.set(`user.${data.id}`, profile);

  return profile;
}
/**
 * @copyright
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */