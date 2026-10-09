import type { Sample } from "../@types/stellar-generated";

export const sumSales = (
  samples: ReadonlyArray<Pick<Sample, "total_sales">> | undefined,
): number => samples?.reduce((total, sample) => total + sample.total_sales, 0) ?? 0;
