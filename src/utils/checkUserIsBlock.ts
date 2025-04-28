import { Context } from "telegraf";
import { QuickDB } from "quick.db";
import error from "./error";

export default async function checkUserIsBlock(
  blocks: QuickDB<{
    id: number;
    message_id: number;
    messsage_text: string;
    date: number;
  }[]>,
  ctx: Context,
  userId: number,
  partnerId: number,
  userBlockFunction?: (ctx: Context) => Promise<any>,
  partnerBlockFunction?: (ctx: Context) => Promise<any>
): Promise<boolean | void> {
  try {
    const
      getUserBlocks = await blocks.get(`${userId}`),
      getPartnerBlocks = await blocks.get(`${partnerId}`);

    if (getUserBlocks && getUserBlocks.some(a => a.id === +partnerId)) {
      if (userBlockFunction)
        await userBlockFunction(ctx);

      return true;
    }

    else if (getPartnerBlocks && getPartnerBlocks.some(a => a.id === userId)) {
      if (partnerBlockFunction)
        await partnerBlockFunction(ctx);

      return true;
    }

    return false;
  } catch (e: any) {
    error(e);
  }
}
/**
 * @copyright
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */