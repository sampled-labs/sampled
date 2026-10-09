import assert from "node:assert/strict";
import { test } from "node:test";
import { withRequiredSigner } from "../src/util/withRequiredSigner.ts";

test("missing signer rejects without ever invoking the upload", async () => {
  let invoked = false;
  await assert.rejects(
    withRequiredSigner(undefined, async () => {
      invoked = true;
      return "should not send";
    }),
    { message: "Unable to sign transaction" },
  );
  assert.equal(invoked, false);
});

test("configured signer reaches the upload and result propagates", async () => {
  const signTransaction = async () => "signature";
  const value = await withRequiredSigner(signTransaction, async (signer) => {
    assert.equal(signer, signTransaction);
    return { transactionHash: "tx-123" };
  });
  assert.deepEqual(value, { transactionHash: "tx-123" });
});
