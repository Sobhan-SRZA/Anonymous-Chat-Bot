"use strict";
/* eslint-disable no-param-reassign */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Collection = void 0;
/**
 * A Map with additional utility methods. This is used throughout discord.js rather than Arrays for anything that has
 * an ID, for significantly improved performance and ease-of-use.
 *
 * @typeParam Key - The key type this collection holds
 * @typeParam Value - The value type this collection holds
 */
class Collection extends Map {
    /**
     * Obtains the value of the given key if it exists, otherwise sets and returns the value provided by the default value generator.
     *
     * @param key - The key to get if it exists, or set otherwise
     * @param defaultValueGenerator - A function that generates the default value
     * @example
     * ```ts
     * collection.ensure(guildId, () => defaultGuildConfig);
     * ```
     */
    ensure(key, defaultValueGenerator) {
        if (this.has(key))
            return this.get(key);
        if (typeof defaultValueGenerator !== 'function')
            throw new TypeError(`${defaultValueGenerator} is not a function`);
        const defaultValue = defaultValueGenerator(key, this);
        this.set(key, defaultValue);
        return defaultValue;
    }
    /**
     * Checks if all of the elements exist in the collection.
     *
     * @param keys - The keys of the elements to check for
     * @returns `true` if all of the elements exist, `false` if at least one does not exist.
     */
    hasAll(...keys) {
        return keys.every((key) => super.has(key));
    }
    /**
     * Checks if any of the elements exist in the collection.
     *
     * @param keys - The keys of the elements to check for
     * @returns `true` if any of the elements exist, `false` if none exist.
     */
    hasAny(...keys) {
        return keys.some((key) => super.has(key));
    }
    first(amount) {
        if (amount === undefined)
            return this.values().next().value;
        if (amount < 0)
            return this.last(amount * -1);
        if (amount >= this.size)
            return [...this.values()];
        const iter = this.values();
        // eslint-disable-next-line unicorn/no-new-array
        const results = new Array(amount);
        for (let index = 0; index < amount; index++) {
            results[index] = iter.next().value;
        }
        return results;
    }
    firstKey(amount) {
        if (amount === undefined)
            return this.keys().next().value;
        if (amount < 0)
            return this.lastKey(amount * -1);
        if (amount >= this.size)
            return [...this.keys()];
        const iter = this.keys();
        // eslint-disable-next-line unicorn/no-new-array
        const results = new Array(amount);
        for (let index = 0; index < amount; index++) {
            results[index] = iter.next().value;
        }
        return results;
    }
    last(amount) {
        if (amount === undefined)
            return this.at(-1);
        if (!amount)
            return [];
        if (amount < 0)
            return this.first(amount * -1);
        const arr = [...this.values()];
        return arr.slice(amount * -1);
    }
    lastKey(amount) {
        if (amount === undefined)
            return this.keyAt(-1);
        if (!amount)
            return [];
        if (amount < 0)
            return this.firstKey(amount * -1);
        const arr = [...this.keys()];
        return arr.slice(amount * -1);
    }
    /**
     * Identical to {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/at | Array.at()}.
     * Returns the item at a given index, allowing for positive and negative integers.
     * Negative integers count back from the last item in the collection.
     *
     * @param index - The index of the element to obtain
     */
    at(index) {
        index = Math.trunc(index);
        if (index >= 0) {
            if (index >= this.size)
                return undefined;
        }
        else {
            index += this.size;
            if (index < 0)
                return undefined;
        }
        const iter = this.values();
        for (let skip = 0; skip < index; skip++) {
            iter.next();
        }
        return iter.next().value;
    }
    /**
     * Identical to {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/at | Array.at()}.
     * Returns the key at a given index, allowing for positive and negative integers.
     * Negative integers count back from the last item in the collection.
     *
     * @param index - The index of the key to obtain
     */
    keyAt(index) {
        index = Math.trunc(index);
        if (index >= 0) {
            if (index >= this.size)
                return undefined;
        }
        else {
            index += this.size;
            if (index < 0)
                return undefined;
        }
        const iter = this.keys();
        for (let skip = 0; skip < index; skip++) {
            iter.next();
        }
        return iter.next().value;
    }
    random(amount) {
        if (amount === undefined)
            return this.at(Math.floor(Math.random() * this.size));
        amount = Math.min(this.size, amount);
        if (!amount)
            return [];
        const values = [...this.values()];
        for (let sourceIndex = 0; sourceIndex < amount; sourceIndex++) {
            const targetIndex = sourceIndex + Math.floor(Math.random() * (values.length - sourceIndex));
            [values[sourceIndex], values[targetIndex]] = [values[targetIndex], values[sourceIndex]];
        }
        return values.slice(0, amount);
    }
    randomKey(amount) {
        if (amount === undefined)
            return this.keyAt(Math.floor(Math.random() * this.size));
        amount = Math.min(this.size, amount);
        if (!amount)
            return [];
        const keys = [...this.keys()];
        for (let sourceIndex = 0; sourceIndex < amount; sourceIndex++) {
            const targetIndex = sourceIndex + Math.floor(Math.random() * (keys.length - sourceIndex));
            [keys[sourceIndex], keys[targetIndex]] = [keys[targetIndex], keys[sourceIndex]];
        }
        return keys.slice(0, amount);
    }
    /**
     * Identical to {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse | Array.reverse()}
     * but returns a Collection instead of an Array.
     */
    reverse() {
        const entries = [...this.entries()].reverse();
        this.clear();
        for (const [key, value] of entries)
            this.set(key, value);
        return this;
    }
    find(fn, thisArg) {
        if (typeof fn !== 'function')
            throw new TypeError(`${fn} is not a function`);
        if (thisArg !== undefined)
            fn = fn.bind(thisArg);
        for (const [key, val] of this) {
            if (fn(val, key, this))
                return val;
        }
        return undefined;
    }
    findKey(fn, thisArg) {
        if (typeof fn !== 'function')
            throw new TypeError(`${fn} is not a function`);
        if (thisArg !== undefined)
            fn = fn.bind(thisArg);
        for (const [key, val] of this) {
            if (fn(val, key, this))
                return key;
        }
        return undefined;
    }
    findLast(fn, thisArg) {
        if (typeof fn !== 'function')
            throw new TypeError(`${fn} is not a function`);
        if (thisArg !== undefined)
            fn = fn.bind(thisArg);
        const entries = [...this.entries()];
        for (let index = entries.length - 1; index >= 0; index--) {
            const val = entries[index][1];
            const key = entries[index][0];
            if (fn(val, key, this))
                return val;
        }
        return undefined;
    }
    findLastKey(fn, thisArg) {
        if (typeof fn !== 'function')
            throw new TypeError(`${fn} is not a function`);
        if (thisArg !== undefined)
            fn = fn.bind(thisArg);
        const entries = [...this.entries()];
        for (let index = entries.length - 1; index >= 0; index--) {
            const key = entries[index][0];
            const val = entries[index][1];
            if (fn(val, key, this))
                return key;
        }
        return undefined;
    }
    sweep(fn, thisArg) {
        if (typeof fn !== 'function')
            throw new TypeError(`${fn} is not a function`);
        if (thisArg !== undefined)
            fn = fn.bind(thisArg);
        const previousSize = this.size;
        for (const [key, val] of this) {
            if (fn(val, key, this))
                this.delete(key);
        }
        return previousSize - this.size;
    }
    filter(fn, thisArg) {
        if (typeof fn !== 'function')
            throw new TypeError(`${fn} is not a function`);
        if (thisArg !== undefined)
            fn = fn.bind(thisArg);
        const results = new this.constructor[Symbol.species]();
        for (const [key, val] of this) {
            if (fn(val, key, this))
                results.set(key, val);
        }
        return results;
    }
    partition(fn, thisArg) {
        if (typeof fn !== 'function')
            throw new TypeError(`${fn} is not a function`);
        if (thisArg !== undefined)
            fn = fn.bind(thisArg);
        const results = [
            new this.constructor[Symbol.species](),
            new this.constructor[Symbol.species](),
        ];
        for (const [key, val] of this) {
            if (fn(val, key, this)) {
                results[0].set(key, val);
            }
            else {
                results[1].set(key, val);
            }
        }
        return results;
    }
    flatMap(fn, thisArg) {
        // eslint-disable-next-line unicorn/no-array-method-this-argument
        const collections = this.map(fn, thisArg);
        return new this.constructor[Symbol.species]().concat(...collections);
    }
    map(fn, thisArg) {
        if (typeof fn !== 'function')
            throw new TypeError(`${fn} is not a function`);
        if (thisArg !== undefined)
            fn = fn.bind(thisArg);
        const iter = this.entries();
        // eslint-disable-next-line unicorn/no-new-array
        const results = new Array(this.size);
        for (let index = 0; index < this.size; index++) {
            const [key, value] = iter.next().value;
            results[index] = fn(value, key, this);
        }
        return results;
    }
    mapValues(fn, thisArg) {
        if (typeof fn !== 'function')
            throw new TypeError(`${fn} is not a function`);
        if (thisArg !== undefined)
            fn = fn.bind(thisArg);
        const coll = new this.constructor[Symbol.species]();
        for (const [key, val] of this)
            coll.set(key, fn(val, key, this));
        return coll;
    }
    some(fn, thisArg) {
        if (typeof fn !== 'function')
            throw new TypeError(`${fn} is not a function`);
        if (thisArg !== undefined)
            fn = fn.bind(thisArg);
        for (const [key, val] of this) {
            if (fn(val, key, this))
                return true;
        }
        return false;
    }
    every(fn, thisArg) {
        if (typeof fn !== 'function')
            throw new TypeError(`${fn} is not a function`);
        if (thisArg !== undefined)
            fn = fn.bind(thisArg);
        for (const [key, val] of this) {
            if (!fn(val, key, this))
                return false;
        }
        return true;
    }
    reduce(fn, initialValue) {
        if (typeof fn !== 'function')
            throw new TypeError(`${fn} is not a function`);
        let accumulator;
        const iterator = this.entries();
        if (initialValue === undefined) {
            if (this.size === 0)
                throw new TypeError('Reduce of empty collection with no initial value');
            accumulator = iterator.next().value[1];
        }
        else {
            accumulator = initialValue;
        }
        for (const [key, value] of iterator) {
            accumulator = fn(accumulator, value, key, this);
        }
        return accumulator;
    }
    reduceRight(fn, initialValue) {
        if (typeof fn !== 'function')
            throw new TypeError(`${fn} is not a function`);
        const entries = [...this.entries()];
        let accumulator;
        let index;
        if (initialValue === undefined) {
            if (entries.length === 0)
                throw new TypeError('Reduce of empty collection with no initial value');
            accumulator = entries[entries.length - 1][1];
            index = entries.length - 1;
        }
        else {
            accumulator = initialValue;
            index = entries.length;
        }
        while (--index >= 0) {
            const key = entries[index][0];
            const val = entries[index][1];
            accumulator = fn(accumulator, val, key, this);
        }
        return accumulator;
    }
    each(fn, thisArg) {
        if (typeof fn !== 'function')
            throw new TypeError(`${fn} is not a function`);
        if (thisArg !== undefined)
            fn = fn.bind(thisArg);
        for (const [key, value] of this) {
            fn(value, key, this);
        }
        return this;
    }
    tap(fn, thisArg) {
        if (typeof fn !== 'function')
            throw new TypeError(`${fn} is not a function`);
        if (thisArg !== undefined)
            fn = fn.bind(thisArg);
        fn(this);
        return this;
    }
    /**
     * Creates an identical shallow copy of this collection.
     *
     * @example
     * ```ts
     * const newColl = someColl.clone();
     * ```
     */
    clone() {
        return new this.constructor[Symbol.species](this);
    }
    /**
     * Combines this collection with others into a new collection. None of the source collections are modified.
     *
     * @param collections - Collections to merge
     * @example
     * ```ts
     * const newColl = someColl.concat(someOtherColl, anotherColl, ohBoyAColl);
     * ```
     */
    concat(...collections) {
        const newColl = this.clone();
        for (const coll of collections) {
            for (const [key, val] of coll)
                newColl.set(key, val);
        }
        return newColl;
    }
    /**
     * Checks if this collection shares identical items with another.
     * This is different to checking for equality using equal-signs, because
     * the collections may be different objects, but contain the same data.
     *
     * @param collection - Collection to compare with
     * @returns Whether the collections have identical contents
     */
    equals(collection) {
        if (!collection)
            return false; // runtime check
        if (this === collection)
            return true;
        if (this.size !== collection.size)
            return false;
        for (const [key, value] of this) {
            if (!collection.has(key) || value !== collection.get(key)) {
                return false;
            }
        }
        return true;
    }
    /**
     * The sort method sorts the items of a collection in place and returns it.
     * If a comparison function is not provided, the function sorts by element values, using the same stringwise comparison algorithm as
     * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort | Array.sort()}.
     *
     * @param compareFunction - Specifies a function that defines the sort order. The return value of this function should be negative if
     * `a` comes before `b`, positive if `b` comes before `a`, or zero if `a` and `b` are considered equal.
     * @example
     * ```ts
     * collection.sort((userA, userB) => userA.createdTimestamp - userB.createdTimestamp);
     * ```
     */
    sort(compareFunction = Collection.defaultSort) {
        const entries = [...this.entries()];
        entries.sort((a, b) => compareFunction(a[1], b[1], a[0], b[0]));
        // Perform clean-up
        super.clear();
        // Set the new entries
        for (const [key, value] of entries) {
            super.set(key, value);
        }
        return this;
    }
    /**
     * The intersection method returns a new collection containing the items where the key is present in both collections.
     *
     * @param other - The other Collection to filter against
     * @example
     * ```ts
     * const col1 = new Collection([['a', 1], ['b', 2]]);
     * const col2 = new Collection([['a', 1], ['c', 3]]);
     * const intersection = col1.intersection(col2);
     * console.log(col1.intersection(col2));
     * // => Collection { 'a' => 1 }
     * ```
     */
    intersection(other) {
        const coll = new this.constructor[Symbol.species]();
        for (const [key, value] of this) {
            if (other.has(key))
                coll.set(key, value);
        }
        return coll;
    }
    /**
     * Returns a new collection containing the items where the key is present in either of the collections.
     *
     * @remarks
     *
     * If the collections have any items with the same key, the value from the first collection will be used.
     * @param other - The other Collection to filter against
     * @example
     * ```ts
     * const col1 = new Collection([['a', 1], ['b', 2]]);
     * const col2 = new Collection([['a', 1], ['b', 3], ['c', 3]]);
     * const union = col1.union(col2);
     * console.log(union);
     * // => Collection { 'a' => 1, 'b' => 2, 'c' => 3 }
     * ```
     */
    union(other) {
        const coll = new this.constructor[Symbol.species](this);
        for (const [key, value] of other) {
            if (!coll.has(key))
                coll.set(key, value);
        }
        return coll;
    }
    /**
     * Returns a new collection containing the items where the key is present in this collection but not the other.
     *
     * @param other - The other Collection to filter against
     * @example
     * ```ts
     * const col1 = new Collection([['a', 1], ['b', 2]]);
     * const col2 = new Collection([['a', 1], ['c', 3]]);
     * console.log(col1.difference(col2));
     * // => Collection { 'b' => 2 }
     * console.log(col2.difference(col1));
     * // => Collection { 'c' => 3 }
     * ```
     */
    difference(other) {
        const coll = new this.constructor[Symbol.species]();
        for (const [key, value] of this) {
            if (!other.has(key))
                coll.set(key, value);
        }
        return coll;
    }
    /**
     * Returns a new collection containing only the items where the keys are present in either collection, but not both.
     *
     * @param other - The other Collection to filter against
     * @example
     * ```ts
     * const col1 = new Collection([['a', 1], ['b', 2]]);
     * const col2 = new Collection([['a', 1], ['c', 3]]);
     * const symmetricDifference = col1.symmetricDifference(col2);
     * console.log(col1.symmetricDifference(col2));
     * // => Collection { 'b' => 2, 'c' => 3 }
     * ```
     */
    symmetricDifference(other) {
        const coll = new this.constructor[Symbol.species]();
        for (const [key, value] of this) {
            if (!other.has(key))
                coll.set(key, value);
        }
        for (const [key, value] of other) {
            if (!this.has(key))
                coll.set(key, value);
        }
        return coll;
    }
    /**
     * Merges two Collections together into a new Collection.
     *
     * @param other - The other Collection to merge with
     * @param whenInSelf - Function getting the result if the entry only exists in this Collection
     * @param whenInOther - Function getting the result if the entry only exists in the other Collection
     * @param whenInBoth - Function getting the result if the entry exists in both Collections
     * @example
     * ```ts
     * // Sums up the entries in two collections.
     * coll.merge(
     *  other,
     *  x => ({ keep: true, value: x }),
     *  y => ({ keep: true, value: y }),
     *  (x, y) => ({ keep: true, value: x + y }),
     * );
     * ```
     * @example
     * ```ts
     * // Intersects two collections in a left-biased manner.
     * coll.merge(
     *  other,
     *  x => ({ keep: false }),
     *  y => ({ keep: false }),
     *  (x, _) => ({ keep: true, value: x }),
     * );
     * ```
     */
    merge(other, whenInSelf, whenInOther, whenInBoth) {
        const coll = new this.constructor[Symbol.species]();
        const keys = new Set([...this.keys(), ...other.keys()]);
        for (const key of keys) {
            const hasInSelf = this.has(key);
            const hasInOther = other.has(key);
            if (hasInSelf) {
                if (hasInOther) {
                    const result = whenInBoth(this.get(key), other.get(key), key);
                    if (result.keep)
                        coll.set(key, result.value);
                }
                else {
                    const result = whenInSelf(this.get(key), key);
                    if (result.keep)
                        coll.set(key, result.value);
                }
            }
            else if (hasInOther) {
                const result = whenInOther(other.get(key), key);
                if (result.keep)
                    coll.set(key, result.value);
            }
        }
        return coll;
    }
    /**
     * Identical to {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toReversed | Array.toReversed()}
     * but returns a Collection instead of an Array.
     */
    toReversed() {
        return new this.constructor[Symbol.species](this).reverse();
    }
    /**
     * The toSorted method returns a shallow copy of the collection with the items sorted.
     * If a comparison function is not provided, the function sorts by element values, using the same stringwise comparison algorithm as
     * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort | Array.sort()}.
     *
     * @param compareFunction - Specifies a function that defines the sort order. The return value of this function should be negative if
     * `a` comes before `b`, positive if `b` comes before `a`, or zero if `a` and `b` are considered equal.
     * @example
     * ```ts
     * const sortedCollection = collection.toSorted((userA, userB) => userA.createdTimestamp - userB.createdTimestamp);
     * ```
     */
    toSorted(compareFunction = Collection.defaultSort) {
        return new this.constructor[Symbol.species](this).sort(compareFunction);
    }
    toJSON() {
        // toJSON is called recursively by JSON.stringify.
        return [...this.entries()];
    }
    /**
     * Emulates the default sort comparison algorithm used in ECMAScript. Equivalent to calling the
     * {@link https://tc39.es/ecma262/multipage/indexed-collections.html#sec-comparearrayelements | CompareArrayElements}
     * operation with arguments `firstValue`, `secondValue` and `undefined`.
     */
    static defaultSort(firstValue, secondValue) {
        if (firstValue === undefined)
            return secondValue === undefined ? 0 : 1;
        if (secondValue === undefined)
            return -1;
        const x = String(firstValue);
        const y = String(secondValue);
        if (x < y)
            return -1;
        if (y < x)
            return 1;
        return 0;
    }
    /**
     * Creates a Collection from a list of entries.
     *
     * @param entries - The list of entries
     * @param combine - Function to combine an existing entry with a new one
     * @example
     * ```ts
     * Collection.combineEntries([["a", 1], ["b", 2], ["a", 2]], (x, y) => x + y);
     * // returns Collection { "a" => 3, "b" => 2 }
     * ```
     */
    static combineEntries(entries, combine) {
        const coll = new Collection();
        for (const [key, value] of entries) {
            if (coll.has(key)) {
                coll.set(key, combine(coll.get(key), value, key));
            }
            else {
                coll.set(key, value);
            }
        }
        return coll;
    }
}
exports.Collection = Collection;
/**
 * @copyright
 * discord.js | https://github.com/discordjs/discord.js
 * @copyright
 */ 
//# sourceMappingURL=Collection.js.map