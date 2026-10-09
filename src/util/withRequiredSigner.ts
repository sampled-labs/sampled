export const withRequiredSigner = async <TSigner, TResult>(
  signer: TSigner | null | undefined,
  send: (signer: TSigner) => Promise<TResult>,
): Promise<TResult> => {
  if (!signer) {
    throw new Error("Unable to sign transaction");
  }
  return send(signer);
};
