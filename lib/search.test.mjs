import assert from "node:assert/strict";
import test from "node:test";
import { matchesSearch } from "./search.ts";

test("matchesSearch", () => {
  const recipe = { title: "Grilled Chicken Thighs", tags: ["dinner", "grill"] };
  assert.equal(matchesSearch(recipe, "chicken"), true);
  assert.equal(matchesSearch(recipe, " DINNER "), true);
  assert.equal(matchesSearch(recipe, "din"), true);
  assert.equal(matchesSearch(recipe, "dessert"), false);
});
