import React from "react";
import { transformShortCode, transformMultiShortCode } from "./util";

/**
 * React short code component
 * @param {string|string[]|function} children
 * @param {boolean} join - Whether to join array at end.
 * @param {object} lookup - Map of shortcode key/value pairs.
 * @param {function} [render] - Render function (used in place of children).
 * @param {object} strings - Used to look up multiple strings (w/ render props or children as function)
 * @param {string|function} tag - React tag to use to wrap.
 * @param {object} tagProps - Props to pass into wrapping element.
 * @return {string|string[]|function}
 */
export default ({
  children = "",
  join = false,
  lookup = {},
  render = undefined,
  strings = {},
  tag: Tag = "span",
  tagProps = {}
} = {}) => {
  const hasRenderFunction = typeof render === "function";
  const hasChildrenFunction = typeof children === "function";
  if (hasRenderFunction || hasChildrenFunction) {
    return (hasChildrenFunction ? children : render)(
      transformMultiShortCode(strings, lookup, join)
    );
  } else {
    return (
      <Tag
        {...tagProps}
        children={transformShortCode(children, lookup, join)}
      />
    );
  }
};
