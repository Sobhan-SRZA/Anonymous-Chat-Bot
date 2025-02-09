import { Scenes, session, Telegraf } from "telegraf";
import { Collection } from "./Collection";
import { MyContext } from "../types/MessageContext";
import { message } from "telegraf/filters";
import { QuickDB } from "quick.db";
import CommandType, { Categories } from "../types/command";
import config from "../../config";
import allScenceStages from "../utils/allScenceStages";

export default class TelegramClient extends Telegraf<MyContext> {
    commands: Collection<string, CommandType>;
    cooldowns: Collection<string, Collection<number, number>>;
    config;
    db: QuickDB | null;

    // Anonymous chat variuables  
    activeChats: QuickDB<number>;
    chatMessages: QuickDB<number[][]>;
    blocks: QuickDB<{ id: number, message_id: number, messsage_text: string, date: number }[]>;
    constructor(token?: string, options?: Telegraf.Options<any>) {

        super(token || config.bot.token, options);
        this.config = config;
        this.commands = new Collection();
        this.cooldowns = new Collection();
        this.db = null;

        // Add session
        this.use(session());
        this.use((ctx, next) => {
            if (ctx.session === undefined)
                ctx.session = {
                    __scenes: {
                        lastMessage: new Collection()
                    }
                };

            return next();
        });

        // Add scenes stages to middleware
        const stage = new Scenes.Stage(
            allScenceStages
        );
        this.use(stage.middleware());
    }

    cmds_info_list_str(category_name: Categories) {
        let description = "";
        this.commands
            .filter(cmd => cmd.category === category_name)
            .forEach((cmd) => {
                description += `**/${cmd.data.name}** - ${cmd.data.description}\n`;
            });

        return description;
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