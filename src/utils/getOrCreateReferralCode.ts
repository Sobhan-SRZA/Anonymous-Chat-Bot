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
 * Coded by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * @copyright
 * Work for Persian Caesar | https://dsc.gg/persian-caesar
 * @copyright
 * Please Mention Us "Persian Caesar", When Have Problem With Using This Code!
 * @copyright
 */