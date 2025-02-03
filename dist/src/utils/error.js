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
 * Coded by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * @copyright
 * Work for Persian Caesar | https://dsc.gg/persian-caesar
 * @copyright
 * Please Mention Us "Persian Caesar", When Have Problem With Using This Code!
 * @copyright
 */ 
//# sourceMappingURL=error.js.map