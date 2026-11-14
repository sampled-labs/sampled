import test from "node:test";
import assert from "node:assert";
import { filterSamplesByGenre } from "./sampleFilters.ts";

const mockSamples = [
  { id: "1", title: "Sample 1", genre: "Rock" },
  { id: "2", title: "Sample 2", genre: "HipHop" },
  { id: "3", title: "Sample 3", genre: "rock" },
  { id: "4", title: "Sample 4", genre: "Jazz" },
];

test("filterSamplesByGenre - returns all samples when id is undefined or 'all'", () => {
  const resUndefined = filterSamplesByGenre(mockSamples, undefined);
  assert.strictEqual(resUndefined.length, 4);

  const resAll = filterSamplesByGenre(mockSamples, "all");
  assert.strictEqual(resAll.length, 4);

  const resAllUpper = filterSamplesByGenre(mockSamples, "ALL");
  assert.strictEqual(resAllUpper.length, 4);
});

test("filterSamplesByGenre - matches genre case-insensitively", () => {
  const resRock = filterSamplesByGenre(mockSamples, "rock");
  assert.strictEqual(resRock.length, 2);
  assert.deepStrictEqual(
    resRock.map((s) => s.id),
    ["1", "3"]
  );

  const resJazz = filterSamplesByGenre(mockSamples, "JAZZ");
  assert.strictEqual(resJazz.length, 1);
  assert.strictEqual(resJazz[0].id, "4");
});

test("filterSamplesByGenre - returns empty array when nothing matches", () => {
  const resClassical = filterSamplesByGenre(mockSamples, "classical");
  assert.strictEqual(resClassical.length, 0);
});
