/**
 * Calculate commission and total returned amount for a service subscription.
 *
 * Formula: total = price + (price * commissionRate / 100)
 *
 * @param {number} price - The service price
 * @param {number} commissionRate - The commission rate in percentage (e.g. 8 for 8%)
 * @returns {{ commission: number, total: number }}
 */
export function calculateCommission(price, commissionRate) {
  if (typeof price !== "number" || typeof commissionRate !== "number") {
    throw new Error("Price and commissionRate must be numbers");
  }

  if (price < 0 || commissionRate < 0) {
    throw new Error("Price and commissionRate must be non-negative");
  }

  const commission = parseFloat(((price * commissionRate) / 100).toFixed(2));
  const total = parseFloat((price + commission).toFixed(2));

  return { commission, total };
}
