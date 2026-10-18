import assert from "node:assert/strict";
import { test } from "node:test";
import { calculateCheckoutTotals } from "./pricing";

test("an 85% promo leaves $30.00 when insurance is declined", () => {
  assert.equal(calculateCheckoutTotals(true, false).total, 30);
});

test("an 85% promo leaves $36.00 with two $20.00 insurance charges", () => {
  const totals = calculateCheckoutTotals(true, true);
  assert.equal(totals.insuranceCharge, 40);
  assert.equal(totals.total, 36);
});