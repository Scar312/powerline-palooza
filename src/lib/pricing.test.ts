import assert from "node:assert/strict";
import { test } from "node:test";
import { calculateCheckoutTotals } from "./pricing";

test("two $375.21 tickets plus the $30 fee total $780.42", () => {
  const totals = calculateCheckoutTotals(false, false);
  assert.equal(totals.ticketSubtotal, 750.42);
  assert.equal(totals.baseTotal, 780.42);
});

test("a 90% promo leaves $78.04 when insurance is declined", () => {
  const totals = calculateCheckoutTotals(true, false);
  assert.equal(totals.discount, 702.38);
  assert.equal(totals.total, 78.04);
});

test("a 90% promo leaves $82.04 with two $20.00 insurance charges", () => {
  const totals = calculateCheckoutTotals(true, true);
  assert.equal(totals.insuranceCharge, 40);
  assert.equal(totals.discount, 738.38);
  assert.equal(totals.total, 82.04);
});