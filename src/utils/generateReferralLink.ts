import TelegramClient from "../classes/Client";
import getOrCreateReferralCode from "./getOrCreateReferralCode";

export default async function generateReferralLink(bot: TelegramClient, userId: number): Promise<string> {
  const
    botUsername = bot.botInfo!.username,
    referralCode = await getOrCreateReferralCode(bot.db!, userId);

  return `https://t.me/${botUsername}?start=${referralCode}`;
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