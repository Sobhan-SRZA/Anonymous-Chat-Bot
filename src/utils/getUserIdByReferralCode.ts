import { QuickDB } from "quick.db";

export default async function getUserIdByReferralCode(db: QuickDB, code: string): Promise<number | null> {
  const userId = await db.get(`referralCode.${code}`);
  
  return userId || null;
}
/**
 * @copyright
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */