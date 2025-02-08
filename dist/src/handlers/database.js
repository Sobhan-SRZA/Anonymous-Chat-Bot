"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const quick_db_1 = require("quick.db");
const console_1 = require("console");
const config_1 = tslib_1.__importDefault(require("../../config"));
const post_1 = tslib_1.__importDefault(require("../functions/post"));
exports.default = async (client) => {
    try {
        let driver;
        switch (config_1.default.source.database.type) {
            case "sql": {
                const { SqliteDriver } = await Promise.resolve().then(() => tslib_1.__importStar(require("quick.db")));
                driver = new SqliteDriver("./");
                break;
            }
            case "mysql": {
                const { MySQLDriver } = await Promise.resolve().then(() => tslib_1.__importStar(require("quick.db")));
                driver = new MySQLDriver(config_1.default.source.database.mysql);
                break;
            }
            case "json": {
                const { JSONDriver } = await Promise.resolve().then(() => tslib_1.__importStar(require("quick.db")));
                driver = new JSONDriver();
                break;
            }
            case "mongodb": {
                const { MongoDriver } = await Promise.resolve(`${"quickmongo"}`).then(s => tslib_1.__importStar(require(s)));
                driver = new MongoDriver(config_1.default.source.database.mongoURL);
                await driver.connect();
                break;
            }
        }
        ;
        const db = new quick_db_1.QuickDB({ driver });
        await db.init();
        client.db = db;
        // Anonymous chat variuables  
        client.activeChats = client.db.table("activeChats");
        client.chatMessages = client.db.table("chatMessages");
        client.blocks = client.db.table("blocks");
        (0, post_1.default)(`Database Is Successfully Activated!! (Type: ${config_1.default.source.database.type.toLocaleUpperCase()})`, "S");
    }
    catch (e) {
        (0, post_1.default)(`Database Doesn't Work!!`.red, "E", "red", "red");
        (0, console_1.error)(e);
    }
};
/**
 * @copyright
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */ 
//# sourceMappingURL=database.js.map