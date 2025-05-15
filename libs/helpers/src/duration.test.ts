import { describe, expect, test } from "vitest";

import { parseDuration, timeToDuration } from "./duration.js";

describe("parseDuration", () => {
  test("can parse duration", () => {
    expect(parseDuration("1h30m45s")).toBe(5445);
    expect(parseDuration("1h30m")).toBe(5400);
    expect(parseDuration("1h")).toBe(3600);
    expect(parseDuration("30m")).toBe(1800);
    expect(parseDuration("45s")).toBe(45);
  });

  test("works on any case", () => {
    expect(parseDuration("1h30m45s")).toBe(5445);
    expect(parseDuration("1H30M45S")).toBe(5445);
  });

  test("throws error on invalid format", () => {
    expect(() => parseDuration("INVALID")).toThrowError("Invalid duration");
  });
});

describe("timeToDuration", () => {
  test("can convert time to duration", () => {
    expect(timeToDuration(12445)).toBe("3h27m25s");
    expect(timeToDuration(5445)).toBe("1h30m45s");
    expect(timeToDuration(5400)).toBe("1h30m");
    expect(timeToDuration(3600)).toBe("1h");
    expect(timeToDuration(1800)).toBe("30m");
    expect(timeToDuration(45)).toBe("45s");
  });
});

test("can go back and forth between duration and time", () => {
  const cases = ["1h30m45s", "1h30m", "1h", "30m", "45s"];

  for (const duration of cases) {
    const time = parseDuration(duration);
    expect(timeToDuration(time)).toBe(duration);
  }
});
