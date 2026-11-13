import assert from "node:assert/strict";
import test from "node:test";
import { instagramEmbedUrl } from "./instagram.ts";

test("instagramEmbedUrl", () => {
  const embed = "https://www.instagram.com/reel/Cx1_a-B/embed";
  assert.equal(instagramEmbedUrl("https://www.instagram.com/reel/Cx1_a-B/?igsh=abc"), embed);
  assert.equal(instagramEmbedUrl("https://instagram.com/reels/Cx1_a-B"), embed);
  assert.equal(instagramEmbedUrl("https://www.instagram.com/cory.cooks/reel/Cx1_a-B/"), embed);
  assert.equal(instagramEmbedUrl("https://www.instagram.com/p/Abc123/"), "https://www.instagram.com/p/Abc123/embed");
  assert.equal(instagramEmbedUrl("https://www.instagram.com/cory.cooks/"), null);
  assert.equal(instagramEmbedUrl("not a link"), null);
});
