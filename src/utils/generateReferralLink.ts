import TelegramClient from "../classes/Client";
import getOrCreateReferralCode from "./getOrCreateReferralCode";

export default async function generateReferralLink(bot: TelegramClient, userId: number): Promise<string> {
  const
    botUsername = bot.botInfo!.username,
    referralCode = await getOrCreateReferralCode(bot.db!, userId);

  return `https://t.me/${encodeURIComponent(botUsername)}?start=${encodeURIComponent(referralCode)}`;
}
/**
 * @copyright
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */