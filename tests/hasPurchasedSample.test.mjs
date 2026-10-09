import assert from "node:assert/strict";
import test from "node:test";
import { hasPurchasedSample } from "../src/util/hasPurchasedSample.ts";

// The generated Client.get_user_purchases result is Sample[], not Purchase[].
// Keep a complete generated-shape fixture: numeric u32 id and bigint i128 price.
/** @type {import("../src/@types/stellar-generated").Sample} */
const sample = Object.freeze({
  bpm: 120,
  cover_image: "fixture.png",
  genre: "fixture",
  id: 7,
  ipfs_link: "ipfs://fixture",
  is_active: true,
  price: 10_000_000n,
  seller: "G_SELLER_A",
  title: "Fixture sample",
  total_sales: 1,
});

/** @type {Awaited<ReturnType<import("../src/@types/stellar-generated").Client["get_user_purchases"]>>["result"]} */
const purchases = [{ ...sample, id: 8 }, { ...sample }];

test("matches an id and seller in the generated get_user_purchases result shape", () => {
  assert.equal(hasPurchasedSample(purchases, sample), true);
});

test("does not match a different sample id from the same seller", () => {
  assert.equal(hasPurchasedSample([{ ...sample, id: 8 }], sample), false);
});

test("does not match the same sample id from a different seller", () => {
  assert.equal(
    hasPurchasedSample([{ ...sample, seller: "G_SELLER_B" }], sample),
    false,
  );
});

test("undefined purchases are not owned", () => {
  assert.equal(hasPurchasedSample(undefined, sample), false);
});
