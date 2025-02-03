import { QuickDB } from "quick.db";

export default async function setUserProfile(db: QuickDB, userId: number, profile: { gender: string }) {
  return await db.set(`user.${userId}`, profile);
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