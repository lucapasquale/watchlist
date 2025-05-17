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
    expect(timeToDuration(12445)).toBe("3:27:25");
    expect(timeToDuration(5445)).toBe("1:30:45");
    expect(timeToDuration(5400)).toBe("1:30:00");
    expect(timeToDuration(3600)).toBe("1:00:00");
    expect(timeToDuration(1800)).toBe("30:00");
    expect(timeToDuration(45)).toBe("0:45");
  });

  test("adds correct padding", () => {
    expect(timeToDuration(3600)).toBe("1:00:00");
    expect(timeToDuration(650)).toBe("10:50");
    expect(timeToDuration(65)).toBe("1:05");
    expect(timeToDuration(27)).toBe("0:27");
    expect(timeToDuration(2)).toBe("0:02");
    expect(timeToDuration(0)).toBe("0:00");
  });
});
