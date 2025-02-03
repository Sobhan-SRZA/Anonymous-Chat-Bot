import { QuickDB } from "quick.db";

export default async function getUserProfile(db: QuickDB, userId: number): Promise<{ gender: string } | null> {
  const profile = await db.get(`user.${userId}`);
  return profile || null;
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