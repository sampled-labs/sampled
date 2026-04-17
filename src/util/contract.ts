/**
 * Shortens a contract ID string by keeping the first `prefixLength` characters,
 * an ellipsis, then the last `suffixLength` characters.
 * If the ID is shorter than or equal to `prefixLength + suffixLength`, returns it unchanged.
 */
export function shortenContractId(
  id: string,
  prefixLength = 5,
  suffixLength = 4,
): string {
  if (id.length <= prefixLength + suffixLength) {
    return id;
  }
  const start = id.slice(0, prefixLength);
  const end = id.slice(-suffixLength);
  return `${start}…${end}`;
}

export const contractId =
  "CDYVZ75YN7355DW6L2BN7SYIAUXNBGZW7FB5ANXPVO7CTU7KKPIFZZVJ";
// "CDNSV67P22CRNMSLV5AEWPKL457PCR5JJISYOKPA5NED5L7WUZJFQEJY";
