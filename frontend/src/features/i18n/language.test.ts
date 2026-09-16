import { test, expect } from "vitest";
import { findUILanguage } from "./language";

test("negotiates locale from a single language tag", () => {
  expect(findUILanguage("en")).toBe("en-US");
  expect(findUILanguage("de")).toBe("de-DE");
  expect(findUILanguage("de-DE")).toBe("de-DE");
  // Regional variants of a supported locale are not a match.
  expect(findUILanguage("de-AT")).toBe("en-US");
  expect(findUILanguage("zh-CN")).toBe("en-US");
});

test("falls back to the default locale", () => {
  expect(findUILanguage(null)).toBe("en-US");
  expect(findUILanguage("")).toBe("en-US");
  expect(findUILanguage("not a language tag")).toBe("en-US");
});

test("negotiates locale from an Accept-Language header by quality", () => {
  expect(findUILanguage("de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7")).toBe("de-DE");
  expect(findUILanguage("en-GB,en;q=0.9")).toBe("en-US");
  expect(findUILanguage("en;q=0.5, de;q=0.9, fr")).toBe("de-DE");
  expect(findUILanguage("zh-CN,de-AT,de")).toBe("de-DE");
  expect(findUILanguage("zh-CN,en,de-AT")).toBe("en-US");
  // A quality of zero rejects the tag outright.
  expect(findUILanguage("de;q=0, en")).toBe("en-US");
});
