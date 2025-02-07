"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Collection = void 0;
class Collection extends Map {
    ensure(key, defaultValueGenerator) {
        if (this.has(key))
            return this.get(key);
        const defaultValue = defaultValueGenerator(key, this);
        this.set(key, defaultValue);
        return defaultValue;
    }
    hasAll(...keys) {
        return keys.every((key) => super.has(key));
    }
    hasAny(...keys) {
        return keys.some((key) => super.has(key));
    }
    first(amount) {
        if (amount === undefined)
            return this.values().next().value;
        return [...this.values()].slice(0, amount);
    }
    filter(fn) {
        const results = new Collection();
        for (const [key, val] of this)
            if (fn(val, key, this))
                results.set(key, val);
        return results;
    }
    find(fn) {
        for (const [key, val] of this)
            if (fn(val, key, this))
                return val;
        return undefined;
    }
    some(fn) {
        for (const [key, val] of this)
            if (fn(val, key, this))
                return true;
        return false;
    }
    map(fn) {
        const results = [];
        for (const [key, val] of this)
            results.push(fn(val, key, this));
        return results;
    }
    forEach(fn) {
        for (const [key, val] of this)
            fn(val, key, this);
        return this;
    }
    clone() {
        return new Collection(this);
    }
}
exports.Collection = Collection;
/**
 * @copyright
 * discord.js | https://github.com/discordjs/discord.js
 *
 * @copyright
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */ 
//# sourceMappingURL=Collection.js.map