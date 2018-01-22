import { transformShortCode, transformMultiShortCode } from "../src/util";

const SHOW_ACTIVE = (index, { active }) => (active ? "ACTIVE" : "INACTIVE");

describe("transformShortCode", () => {
  describe("Returns", () => {
    it("should return an array", () => {
      expect(Array.isArray(transformShortCode())).toBeTruthy();
      expect(Array.isArray(transformShortCode("foo"))).toBeTruthy();
    });

    it("should return a string if join is true", () => {
      expect(typeof transformShortCode("", {}, true)).toEqual("string");
      expect(typeof transformShortCode("foo", {}, true)).toEqual("string");
    });
  });

  describe("Lookups", () => {
    it("should return transformed shortcodes", () => {
      expect(
        transformShortCode("foo [[bar]] baz", { bar: () => "BAR" })
      ).toEqual(["foo ", "BAR", " baz"]);

      expect(
        transformShortCode("foo [[bar]] baz", { bar: () => "BAR" }, true)
      ).toEqual("foo BAR baz");
    });

    it("should return shortcode if no key found", () => {
      expect(
        transformShortCode("foo [[baz]] baz", { bar: () => "BAR" }, true)
      ).toEqual("foo [[baz]] baz");
    });
  });

  describe("Index", () => {
    it("should pass index to shortcode function", () => {
      expect(
        transformShortCode(
          'foo [[bar name="dave"]] baz',
          { bar: index => `shortcode ${index + 1}` },
          true
        )
      ).toEqual("foo shortcode 1 baz");
    });
  });

  describe("Attributes", () => {
    it("should pass attributes to shortcode function", () => {
      expect(
        transformShortCode(
          'foo [[bar name="dave"]] baz',
          { bar: (index, { name }) => name },
          true
        )
      ).toEqual("foo dave baz");
    });

    it("should transform boolean attributes", () => {
      expect(
        transformShortCode(
          'foo [[bar active="false"]] [[bar active="true"]] baz',
          {
            bar: (count, { active }) => (active ? "ACTIVE" : "INACTIVE")
          },
          true
        )
      ).toEqual("foo INACTIVE ACTIVE baz");
    });

    it("should transform empty attributes", () => {
      expect(
        transformShortCode(
          'foo [[bar active=""]] [[bar active]] baz',
          {
            bar: (index, { active }) => (active ? "ACTIVE" : "INACTIVE")
          },
          true
        )
      ).toEqual("foo INACTIVE INACTIVE baz");
    });
  });
});

describe("transformMultiShortCode", () => {
  describe("Returns", () => {
    it("should return an object", () => {
      expect(typeof transformMultiShortCode()).toEqual("object");
      expect(typeof transformMultiShortCode({})).toEqual("object");
    });

    it("should return a object with strings if join is true", () => {
      expect(
        typeof transformMultiShortCode({ foo: "" }, {}, true)["foo"]
      ).toEqual("string");
      expect(
        typeof transformMultiShortCode(
          { foo: "foo" },
          { foo: () => "bar" },
          true
        )["foo"]
      ).toEqual("string");
    });
  });

  describe("Lookups", () => {
    it("should return transformed shortcodes", () => {
      expect(
        transformMultiShortCode(
          { foo: "foo [[bar]] baz" },
          { bar: () => "BAR" }
        )
      ).toEqual({ foo: ["foo ", "BAR", " baz"] });

      expect(
        transformMultiShortCode(
          { foo: "foo [[bar]] baz" },
          { bar: () => "BAR" },
          true
        )
      ).toEqual({ foo: "foo BAR baz" });
    });

    it("should return shortcode if no key found", () => {
      expect(
        transformMultiShortCode(
          { foo: "foo [[baz]] baz" },
          { bar: () => "BAR" },
          true
        )
      ).toEqual({ foo: "foo [[baz]] baz" });
    });
  });

  describe("Index", () => {
    it("should pass index to shortcode function", () => {
      expect(
        transformMultiShortCode(
          { foo: 'foo [[bar name="dave"]] baz' },
          { bar: index => `shortcode ${index + 1}` },
          true
        )
      ).toEqual({ foo: "foo shortcode 1 baz" });
    });
  });

  describe("Attributes", () => {
    it("should pass attributes to shortcode function", () => {
      expect(
        transformMultiShortCode(
          { foo: 'foo [[bar name="dave"]] baz' },
          { bar: (index, { name }) => name },
          true
        )
      ).toEqual({ foo: "foo dave baz" });
    });

    it("should transform boolean attributes", () => {
      expect(
        transformMultiShortCode(
          { foo: 'foo [[bar active="false"]] [[bar active="true"]] baz' },
          {
            bar: (count, { active }) => (active ? "ACTIVE" : "INACTIVE")
          },
          true
        )
      ).toEqual({ foo: "foo INACTIVE ACTIVE baz" });
    });

    it("should transform empty attributes", () => {
      expect(
        transformMultiShortCode(
          { foo: 'foo [[bar active=""]] [[bar active]] baz' },
          {
            bar: (index, { active }) => (active ? "ACTIVE" : "INACTIVE")
          },
          true
        )
      ).toEqual({ foo: "foo INACTIVE INACTIVE baz" });
    });
  });
});
