import { QuickDB } from "quick.db";
import Profile from "../types/UserProfile";
interface newProfile extends Profile { id?: number }

export default async function getRecentlyActiveUsers(db: QuickDB, onlineThreshold = 5 * 60 * 1000): Promise<newProfile[]> {
  const
    allUsers: Record<string, Profile> | null = await db.get("user")!,
    currentTime = Date.now(),
    activeProfiles: Profile[] = [];

  for (const user in allUsers) {
      let profile: newProfile = allUsers[user];
      profile = {
        ...profile,
        id: +user
      }
      if (profile.permissions?.random_chat && profile.lastSeen && (currentTime - profile.lastSeen < onlineThreshold))
        activeProfiles.push(profile);
      
  }

  return activeProfiles;
}
/**
 * @copyright
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */