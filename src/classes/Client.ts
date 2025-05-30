import { Scenes, session, Telegraf } from "telegraf";
import { InlineKeyboardMarkup } from "telegraf/typings/core/types/typegram";
import { Collection } from "./Collection";
import { MyContext } from "../types/MessageContext";
import { UserData } from "../types/UserProfile";
import { QuickDB } from "quick.db";
import CommandType, { Categories } from "../types/command";
import allScenceStages from "../utils/allScenceStages";
import config from "../../config";

export default class TelegramClient extends Telegraf<MyContext> {
    commands: Collection<string, CommandType>;
    cooldowns: Collection<string, Collection<number, number>>;
    config;
    db: QuickDB | null;

    // Anonymous chat variuables  
    activeChats: QuickDB<number> | null;
    chatMessages: QuickDB<{ reply_markup?: InlineKeyboardMarkup, message_id: number, control_message_id?: number }[][]> | null;
    blocks: QuickDB<{ id: number, message_id: number, messsage_text: string, date: number }[]> | null;
    users: QuickDB<UserData> | null;
    constructor(token?: string, options?: Telegraf.Options<any>) {

        super(token || config.bot.token, options);
        this.config = config;
        this.commands = new Collection();
        this.cooldowns = new Collection();

        // initialize QuickDB
        this.db = null;
        this.setDB();

        // Anonymous chat variuables  
        this.activeChats = null;
        this.chatMessages = null;
        this.blocks = null;
        this.users = null;

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

    public cmds_info_list_str(category_name: Categories) {
        let description = "";
        this.commands
            .filter(cmd => cmd.category === category_name)
            .forEach((cmd) => {
                description += `**/${cmd.data.name}** - ${cmd.data.description}\n`;
            });

        return description;
    }

    private async setDB() {
        const
            databaseFile = await import("../utils/database"),
            loadDB = databaseFile.default || databaseFile,
            database = await loadDB();

        if (database) {
            this.db = database;

            // Anonymous chat variuables  
            this.activeChats = this.db.table("activeChats");
            this.chatMessages = this.db.table("chatMessages");
            this.blocks = this.db.table("blocks");
            this.users = this.db.table("users");
        }

        return this;
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