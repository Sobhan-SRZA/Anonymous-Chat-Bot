export class Collection<Key, Value> extends Map<Key, Value> {
 public ensure(key: Key, defaultValueGenerator: (key: Key, collection: this) => Value): Value {
  if (this.has(key))
   return this.get(key)!;

  const defaultValue = defaultValueGenerator(key, this);
  this.set(key, defaultValue);
  return defaultValue;
 }

 public hasAll(...keys: Key[]): boolean {
  return keys.every((key) => super.has(key));
 }

 public hasAny(...keys: Key[]): boolean {
  return keys.some((key) => super.has(key));
 }

 public first(): Value | undefined;
 public first(amount: number): Value[];
 public first(amount?: number): Value | Value[] | undefined {
  if (amount === undefined)
   return this.values().next().value;

  return [...this.values()].slice(0, amount);
 }

 public filter(fn: (value: Value, key: Key, collection: this) => boolean): Collection<Key, Value> {
  const results = new Collection<Key, Value>();
  for (const [key, val] of this)
   if (fn(val, key, this))
    results.set(key, val);

  return results;
 }

 public find(fn: (value: Value, key: Key, collection: this) => boolean): Value | undefined {
  for (const [key, val] of this)
   if (fn(val, key, this))
    return val;

  return undefined;
 }

 public some(fn: (value: Value, key: Key, collection: this) => boolean): boolean {
  for (const [key, val] of this)
   if (fn(val, key, this))
    return true;

  return false;
 }

 public map<NewValue>(fn: (value: Value, key: Key, collection: this) => NewValue): NewValue[] {
  const results: NewValue[] = [];
  for (const [key, val] of this)
   results.push(fn(val, key, this));

  return results;
 }

 public forEach(fn: (value: Value, key: Key, collection: this) => void): this {
  for (const [key, val] of this)
   fn(val, key, this);

  return this;
 }

 public clone(): Collection<Key, Value> {
  return new Collection(this);
 }
}
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