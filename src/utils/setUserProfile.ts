import { QuickDB } from "quick.db";
import Profile from "../types/UserProfile";

export default async function setUserProfile(db: QuickDB, userId: number, profile: Profile) {
  return await db.set(`user.${userId}`, profile);
}
/**
 * @copyright
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */