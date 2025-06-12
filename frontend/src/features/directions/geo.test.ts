import { test, expect } from "vitest";
import { heightsToGains } from "./geo";

test("heights to gains", () => {
  const heights: [number, number][] = [
    [0, -5],
    [1, 0],
    [2, 10],
    [3, 5],
    [4, 10],
    [5, 20],
    [6, 0],
  ];
  expect(heightsToGains(heights)).toEqual([30, 25]);
});
