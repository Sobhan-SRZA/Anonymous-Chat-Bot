"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = require("fs");
const post_1 = tslib_1.__importDefault(require("../functions/post"));
exports.default = async (client) => {
    let amount = 0;
    const path = `${process.cwd()}/dist/src/events`;
    const events = (0, fs_1.readdirSync)(`${path}`).filter(files => files.endsWith(".js"));
    for (const file of events) {
        const eventModule = await Promise.resolve(`${`${path}/${file}`}`).then(s => tslib_1.__importStar(require(s)));
        const event = eventModule.default || eventModule;
        client.on(event.name, event.run.bind(null, client));
        amount++;
    }
    ;
    (0, post_1.default)(String(amount).cyan + " Events Is Loaded!!".green, "S");
};
/**
 * @copyright
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */ 
//# sourceMappingURL=eventsHandler.js.map