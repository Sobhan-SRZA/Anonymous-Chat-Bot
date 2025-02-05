import { readdirSync } from "fs";
import post from "../functions/post";
import TelegramClient from "../classes/Client";

export default async (client: TelegramClient) => {
  let amount: number = 0;
  const path = `${process.cwd()}/dist/src/events`;
  const events = readdirSync(`${path}`).filter(files => files.endsWith(".js"));
  for (const file of events) {
    const eventModule = await import(`${path}/${file}`);
    const event = eventModule.default || eventModule;
    client.on(event.name, event.run.bind(null, client));
    amount++;
  };
  post(String(amount).cyan + " Events Is Loaded!!".green, "S");
}
/**
 * @copyright
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */