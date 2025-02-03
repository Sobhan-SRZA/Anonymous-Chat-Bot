import { QuickDB } from "quick.db";

export default async function getUserIdByReferralCode(db: QuickDB, code: string): Promise<number | null> {
  const userId = await db.get(`referralCode.${code}`);
  return userId || null;
}
/**
 * @copyright
 * Coded by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * @copyright
 * Work for Persian Caesar | https://dsc.gg/persian-caesar
 * @copyright
 * Please Mention Us "Persian Caesar", When Have Problem With Using This Code!
 * @copyright
 */