import { describe, expect, it } from "vitest";

import { getUrlKind } from "./services.js";

describe("getUrlKind", () => {
  const TEST_CASES = [
    [
      "https://www.twitch.tv/mogulmoves/clip/ProtectiveIgnorantHippoHotPokket-58un43BmWmGiLbJC?filter=clips&range=7d&sort=time",
      "twitch_clip",
    ],
    [
      "https://old.reddit.com/r/TikTokCringe/comments/1ezcmnq/yamaha_coming_up_with_their_products/",
      "reddit",
    ],
  ];

  it.for(TEST_CASES)("%# %c %s", ([rawURL, kind]) => {
    const url = new URL(rawURL!);

    expect(getUrlKind(url)).toEqual(kind);
  });
});
