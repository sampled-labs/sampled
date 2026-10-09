import assert from "node:assert/strict";
import { test } from "node:test";
import { sumSales } from "../src/util/sumSales.ts";

test("unresolved sample query renders zero hits", () => {
  assert.equal(sumSales(undefined), 0);
});

test("empty sample list renders zero hits", () => {
  assert.equal(sumSales([]), 0);
});

test("populated sample list sums each total_sales", () => {
  assert.equal(sumSales([{ total_sales: 3 }, { total_sales: 0 }, { total_sales: 7 }]), 10);
});
