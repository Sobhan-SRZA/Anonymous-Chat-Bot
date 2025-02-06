import { QuickDB } from "quick.db";
import getUserProfile from "./getUserProfile";
import setUserProfile from "./setUserProfile";
import Profile from "../types/UserProfile";

export default async function updateUserProfileLastSeen(db: QuickDB, userId: number) {
  const profile: Profile | null = await getUserProfile(db, userId);
  if (profile) {
    profile.lastSeen = Date.now();
    await setUserProfile(db, userId, profile);
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