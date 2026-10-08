import type { Sample } from "../../@types/stellar-generated";

const normalize = (value: string) => value.trim().toLocaleLowerCase();

/** Genre names in links and on-chain samples differ only by case. */
export function filterSamplesByGenre(samples: Sample[], genre?: string): Sample[] {
  const selectedGenre = normalize(genre ?? "");
  if (!selectedGenre || selectedGenre === "all") return samples;
  return samples.filter((sample) => normalize(sample.genre) === selectedGenre);
}

/** Match the visible title or seller address, independent of casing. */
export function filterSamplesBySearch(samples: Sample[], query: string): Sample[] {
  const term = normalize(query);
  if (!term) return samples;
  return samples.filter(
    (sample) =>
      normalize(sample.title).includes(term) ||
      normalize(sample.seller).includes(term),
  );
}
