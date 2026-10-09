import test from "node:test";
import assert from "node:assert/strict";
import { parseTokenUnits, splitRevenueUnits, formatTokenUnits } from "./revenue-split.ts";

test("odd token-base-unit prices preserve the platform/seller total", () => {
  for (const total of [1n, 9n, 11n, 101n, 10000001n, 19999999n]) {
    const { platform, seller } = splitRevenueUnits(total, 10);
    assert.equal(platform + seller, total);
    assert.equal(platform, total / 10n);
  }
  assert.deepEqual(splitRevenueUnits(10000001n, 10), { platform: 1000000n, seller: 9000001n });
});

test("the upload preview matches a non-round on-chain fee split at 7 decimal places", () => {
  const total = parseTokenUnits("1.0000001");
  const { seller, platform } = splitRevenueUnits(total, 10);
  assert.equal(total, 10000001n);
  assert.equal(formatTokenUnits(seller), "0.9000001");
  assert.equal(formatTokenUnits(platform), "0.1");
  assert.throws(() => parseTokenUnits("0.00000001"), RangeError);
  assert.throws(() => parseTokenUnits("0"), RangeError);
});
