import generateReferralCode from "./generateReferralCode";
import { QuickDB } from "quick.db";

export default async function getOrCreateReferralCode(db: QuickDB, userId: number): Promise<string> {
  let code = await db.get(`referral.${userId}`);
  if (code)
    return code;

  code = generateReferralCode();
  await db.set(`referral.${userId}`, code);
  await db.set(`referralCode.${code}`, userId);
  return code;
}
/**
 * @copyright
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */