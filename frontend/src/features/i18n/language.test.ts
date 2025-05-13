import { test, expect } from "vitest";
import { findUILanguage } from "./language";

test("find UI language", () => {
  expect(findUILanguage(["zh-CN"])).toBe("en-US");
  expect(findUILanguage(["zh-CN", "de-DE"])).toBe("de-DE");
  expect(findUILanguage(["zh-CN", "de-AT", "de"])).toBe("de-DE");
  expect(findUILanguage(["zh-CN", "en-GB", "de-AT", "de"])).toBe("de-DE");
  expect(findUILanguage(["zh-CN", "en", "de-AT"])).toBe("en-US");
});
