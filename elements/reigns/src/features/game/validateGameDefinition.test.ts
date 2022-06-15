import { Card } from "./types";
import {
  validateCards,
  getFlags,
  validateFlags,
  getConditions,
  validateAssetsUrl,
} from "./validateGameDefinition";
import gdpr from "../../../public/games/gdpr.json";
import dont_starve from "../../../public/games/dont-starve.json";

describe("validateGameDefinition", () => {
  describe("validateCards", () => {
    it("should succeed if cards are valid", () => {
      expect(() =>
        validateCards([
          {
            card: "some card",
            weight: 1,
          } as Card,
        ])
      ).not.toThrow();
    });
    it("should throw if no cards", () => {
      expect(() => validateCards([])).toThrow();
    });

    it("should throw if weight less than 1", () => {
      expect(() => validateCards([{ weight: 0 } as Card])).toThrow();
    });

    it("should throw if weight higher than 100", () => {
      expect(() => validateCards([{ weight: 101 } as Card])).toThrow();
    });

    it("should throw if bad conditions", () => {
      expect(() =>
        validateCards([
          {
            card: "some card",
            weight: 1,
            conditions: "some rubbish",
          } as Card,
        ])
      ).toThrow();
    });

    it("should pass if good conditions", () => {
      expect(() =>
        validateCards([
          {
            card: "some card",
            weight: 1,
            conditions: "someCondition==true",
          } as Card,
        ])
      ).not.toThrow();
    });
  });

  describe("getFlags", () => {
    const getCard = () =>
      ({
        yes_custom: "someFlag=true",
        no_custom: "someOtherFlag=true",
      } as Card);
    it("should return empty array if no flags", () => {
      expect(getFlags({} as Card, "yes_custom")).toEqual([]);
    });

    it("should return no flags", () => {
      const result = getFlags(getCard(), "no_custom");
      expect(result).toEqual([{ key: "someOtherFlag", value: "true" }]);
    });

    it("should return yes flags", () => {
      const result = getFlags(getCard(), "yes_custom");
      expect(result).toEqual([{ key: "someFlag", value: "true" }]);
    });
  });
  describe("validateFlags", () => {
    const validate = (flag: string) =>
      validateFlags(
        getFlags({ yes_custom: flag } as Card, "yes_custom"),
        "yes_custom",
        1
      );
    it("should throw on multiple operators", () => {
      expect(() => validate("key==true")).toThrow();
    });

    it("should allow multiple flags separated by space", () => {
      expect(() => validate("key1=true key2=true")).not.toThrow();
    });

    it("should throw if duplicate flag", () => {
      expect(() => validate("key1=true key1=true")).toThrow();
    });

    it("should throw if value not boolean", () => {
      expect(() => validate("key1=not_a_boolean")).toThrow();
    });
  });

  describe("validateConditions", () => {
    const validate = (flag: string) =>
      validateFlags(
        getConditions({ conditions: flag } as Card),
        "conditions",
        1
      );
    it("should throw on multiple operators", () => {
      expect(() => validate("a==b==true")).toThrow();
    });

    it("should allow multiple flags separated by space", () => {
      expect(() => validate("key1==true key2==true")).not.toThrow();
    });

    it("should throw if duplicate flag", () => {
      expect(() => validate("key1==true key1==true")).toThrow();
    });

    it("should throw if value not boolean", () => {
      expect(() => validate("key1==not_a_boolean")).toThrow();
    });
  });

  describe("games", () => {
    it("should validate gdpr", () => {
      const iterator = gdpr.cards.values();
      const cards: Card[] = Array.from(iterator);
      expect(() => validateCards(cards)).not.toThrow();
    });
    it("should validate dont_starve", () => {
      const iterator = dont_starve.cards.values();
      const cards: Card[] = Array.from(iterator);
      expect(() => validateCards(cards)).not.toThrow();
    });
  });

  describe("validateAssetsUrl", () => {
    it("returns a default empty string", () => {
      const foo = null as unknown as string;
      expect(validateAssetsUrl(foo)).toBe("");
    });

    it("keep a default https url ", () => {
      expect(validateAssetsUrl("https://foo.fr/mar/fi")).toBe(
        "https://foo.fr/mar/fi"
      );
    });

    it("remove a trailing slash for an https url ", () => {
      expect(validateAssetsUrl("https://foo.fr/mar/fi/knine/")).toBe(
        "https://foo.fr/mar/fi/knine"
      );
    });

    it("uses the location pathname to prefix non http url", () => {
      global.document = {
        location: {
          pathname: "/",
        },
      } as any;
      expect(validateAssetsUrl("foo")).toBe("/foo");
    });

    it("when pathaname is a file, uses the current pathname folder to prefix non http url", () => {
      global.document = {
        location: {
          pathname: "/foo/bar/baz",
        },
      } as any;
      expect(validateAssetsUrl("qux")).toBe("/foo/bar/qux");
    });

    it("when pathname is a folder, uses the location pathname to prefix non http url", () => {
      global.document = {
        location: {
          pathname: "/foo/bar/baz/",
        },
      } as any;
      expect(validateAssetsUrl("qux")).toBe("/foo/bar/baz/qux");
    });

    it("remove trailing slash from provided url", () => {
      global.document = {
        location: {
          pathname: "/foo/e",
        },
      } as any;
      expect(validateAssetsUrl("quzz/")).toBe("/foo/quzz");
    });
  });
});
