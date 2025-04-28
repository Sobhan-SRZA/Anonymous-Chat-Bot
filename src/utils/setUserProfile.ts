import { QuickDB } from "quick.db";
import Profile, { UserData } from "../types/UserProfile";
import setUserData from "./setUserData";
import client from "../..";

export default async function setUserProfile(db: QuickDB, data: UserData, profile: Profile) {
  await setUserData(client.users!, data);
  await db.set(`user.${data.id}`, profile);

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