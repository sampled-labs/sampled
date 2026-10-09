/** Soroban token amounts use seven decimal places; split fees on integer base units. */
export const TOKEN_UNITS = 10_000_000n;

export function parseTokenUnits(price: string): bigint {
  const text = price.trim();
  if (!/^\d+(?:\.\d{1,7})?$/.test(text)) {
    throw new RangeError("Price must be a non-negative decimal with at most 7 fractional places");
  }
  const [whole, fraction = ""] = text.split(".");
  const units = BigInt(whole) * TOKEN_UNITS + BigInt(fraction.padEnd(7, "0"));
  if (units <= 0n) throw new RangeError("Price must be greater than zero");
  return units;
}

/** Platform receives floor(price * fee / 100); seller gets the remaining units. */
export function splitRevenueUnits(priceUnits: bigint, platformFeePercentage: number) {
  if (priceUnits < 0n || !Number.isInteger(platformFeePercentage) || platformFeePercentage < 0 || platformFeePercentage > 100) {
    throw new RangeError("Invalid price units or platform percentage");
  }
  const platform = (priceUnits * BigInt(platformFeePercentage)) / 100n;
  const seller = priceUnits - platform;
  return { platform, seller };
}

/** Display precisely what the token transaction would transfer, without float rounding. */
export function formatTokenUnits(units: bigint): string {
  if (units < 0n) throw new RangeError("Cannot format negative token units");
  const whole = units / TOKEN_UNITS;
  const tail = (units % TOKEN_UNITS).toString().padStart(7, "0").replace(/0+$/, "");
  return tail ? `${whole}.${tail}` : `${whole}`;
}
