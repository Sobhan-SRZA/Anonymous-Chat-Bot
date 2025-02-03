import chooseRandom from "../functions/chooseRandom";

export default function generateReferralCode(): string {
  const length = chooseRandom([5, 6, 7, 8, 9, 10]); // Use 5-10 length for key generating length
  let key = "";
  let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  for (var i = 0; i < length; i++)
    key += chars.charAt(Math.floor(Math.random() * chars.length));

  return key;
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