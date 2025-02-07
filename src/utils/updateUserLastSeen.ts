import { QuickDB } from "quick.db";

export default async function updateUserLastSeen(db: QuickDB, userId: number) {
  return await db.set(`user.${userId}.lastSeen`, Date.now());
}
/**
 * @copyright
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */