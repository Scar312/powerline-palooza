export const TICKET_UNIT_DISPLAY = 375.21;
export const TICKET_QTY = 2;
export const TICKET_SUBTOTAL = TICKET_UNIT_DISPLAY * TICKET_QTY;
export const SERVICE_FEE = 30;
export const INSURANCE_PER_TICKET = 20;

function roundMoney(amount: number) {
  return Math.round((amount + Number.EPSILON) * 100) / 100;
}

export function calculateCheckoutTotals(promoApplied: boolean, insuranceSelected: boolean) {
  const insuranceTotal = INSURANCE_PER_TICKET * TICKET_QTY;
  const insuranceCharge = insuranceSelected ? insuranceTotal : 0;
  const baseTotal = TICKET_SUBTOTAL + SERVICE_FEE + insuranceCharge;
  const discount = promoApplied ? roundMoney(baseTotal * 0.9) : 0;
  const total = Math.max(0, roundMoney(baseTotal - discount));

  return {
    ticketSubtotal: TICKET_SUBTOTAL,
    insuranceTotal,
    insuranceCharge,
    baseTotal,
    discount,
    total,
  };
}