import { test, expect } from "vitest";
import { positionsToRequest } from "./routing";

test("generate params", () => {
  const points = [
    {
      lng: 5,
      lat: 10.1,
    },
    {
      lng: 6.1,
      lat: 11,
    },
    {
      lng: -7.12345,
      lat: -12.12345,
    },
  ];
  expect(positionsToRequest(points)).toBe(
    `{"range":true,"resample_distance":30,"shape":[{"lat":10.1,"lon":5},{"lat":11,"lon":6.1},{"lat":-12.12345,"lon":-7.12345}]}`,
  );
});
