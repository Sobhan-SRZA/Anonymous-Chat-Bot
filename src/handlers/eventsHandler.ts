import { readdirSync } from "fs";
import post from "../functions/post";
import TelegramClient from "../classes/Client";

export default async (client: TelegramClient) => {
  let amount: number = 0;
  const path = `${process.cwd()}/dist/src/events`;
  for (const dirs of readdirSync(path)) {
    const events = readdirSync(`${path}/${dirs}`).filter(files => files.endsWith(".js"));
    for (const file of events) {
      const eventModule = await import(`${path}/${dirs}/${file}`);
      const event = eventModule.default || eventModule;
      client.on(event.name, event.run.bind(null, client));
      amount++;
    };
  }
  post(String(amount).cyan + " Events Is Loaded!!".green, "S");
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