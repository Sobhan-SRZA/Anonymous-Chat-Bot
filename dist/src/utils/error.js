"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = error;
const tslib_1 = require("tslib");
const post_1 = tslib_1.__importDefault(require("../functions/post"));
function error(error) {
    try {
        if (false) { }
        else
            console.log(error);
    }
    catch (e) {
        (0, post_1.default)("Error logger to discord webhook have bug!!", "E", "red", "red");
        console.log(e);
        (0, post_1.default)("Main Error:", "E", "red", "red");
        console.log(error);
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
//# sourceMappingURL=error.js.map