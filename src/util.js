export const REGEX_SHORTCODE = /\[\[(.*?)\]\]/g; // [[foo-bar]]
export const REGEX_ATTRIBUTE = /(.+?)="(.+?)"/g; // foo="bar"

/**
 * Transform boolean values
 * @param {string} _str - String to transform.
 * @return {(string|boolean)} - Initial string or boolean.
 * @example transformValue("true") // true
 * @example transformValue("bar") // "bar"
 */
export const transformValue = _str => {
  const str = _str.toLowerCase();
  if (str === "true") return true;
  if (str === "false") return false;
  return _str;
};

/**
 * Pull attributes from shortcode
 * @param {string} str - Inner content of shortcode
 * @return {string} - Key/value pair of attributes
 * @example getAttrs('foo="bar"') // { foo: "bar" }
 */
const getAttrs = str => {
  let match = REGEX_ATTRIBUTE.exec(str);
  let attrs = {};
  while (match) {
    attrs[match[1]] = transformValue(match[2]);
    match = REGEX_ATTRIBUTE.exec(str);
  }
  return attrs;
};

/**
 * Transform string with components or new strings
 * @param {string} str - String to replace.
 * @param {object} lookup - Lookup object with keys matching shortcodes.
 * @param {bool} join - Boolean to re-join result.
 * @return {(string[]|string)}
 * @example
 * transformShortCode(
 *   "foo [[bar]] baz",
 *   { bar: () => "BAR" },
 *   true
 *  ) // { foo: "foo BAR baz" }
 */
export const transformShortCode = (str = "", lookup = {}, join = false) => {
  if (typeof str !== "string") {
    return str;
  }

  const result = [];

  let count = 0;
  let index = 0;

  let match = REGEX_SHORTCODE.exec(str);
  while (match) {
    const [shortcode, inner] = match;
    const [name, ...rest] = inner.split(" ");
    const fn = lookup[name];

    // Push string before shortcode
    result.push(str.slice(index, match.index));

    if (typeof fn === "function") {
      // Invoke function with count and any attributes
      // e.g. (count, {key1: value1, key2: value2 }) => key1 + key2
      result.push(fn(count, getAttrs(rest.join(" "))));
    } else {
      // Fall back to shortcode.
      result.push(shortcode);
    }

    // Update indexes and counts
    index = match.index + shortcode.length;
    count++;

    // Grab new match and repeat
    match = REGEX_SHORTCODE.exec(str);
  }

  // Push rest of string
  result.push(str.slice(index));
  return join ? result.join("") : result;
};

/**
 * Transform multiple strings with components or new strings
 * @param {strings} object - Strings to replace.
 * @param {object} lookup - Lookup object with keys matching shortcodes.
 * @param {bool} join - Boolean to re-join result.
 * @example
 * transformMultiShortCode(
 *   { foo: "foo [[bar]] baz" },
 *   { bar: () => "BAR" },
 *   true
 *  ) // { foo: "foo BAR baz" }
 */
export const transformMultiShortCode = (
  strings = {},
  lookup = {},
  join = false
) => {
  const acc = {};
  const keys = Object.keys(strings);
  for (let i = 0; i < keys.length; i++) {
    acc[keys[i]] = transformShortCode(strings[keys[i]], lookup, join);
  }
  return acc;
};
