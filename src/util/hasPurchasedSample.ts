import type { Sample } from "../@types/stellar-generated";

/** get_user_purchases returns Sample[], not the separate Purchase record type. */
export function hasPurchasedSample(
  purchases: ReadonlyArray<Sample> | null | undefined,
  sample: Pick<Sample, "id" | "seller">,
): boolean {
  return (
    purchases?.some(
      (purchase) =>
        purchase.id === sample.id && purchase.seller === sample.seller,
    ) ?? false
  );
}
