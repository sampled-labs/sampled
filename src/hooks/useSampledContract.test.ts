import { describe, it, expect, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useUploadSample } from "./useSampledContract";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "";

vi.mock("./useWallet", () => ({
  useWallet: () => ({
    address: "G123456789",
    signTransaction: undefined,
  }),
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("useUploadSample", () => {
  it("fails loudly when no signer is present", async () => {
    const { result } = renderHook(() => useUploadSample(), { wrapper });

    let caughtError: unknown;
    try {
      await result.current.mutateAsync({
        price: 100n,
        ipfs_link: "ipfs://test",
        bpm: 120,
        title: "Test Sample",
        genre: "trap" as any,
        seller: "G123456789",
        cover_image: "",
      });
    } catch (err) {
      caughtError = err;
    }

    expect(caughtError).toBeInstanceOf(Error);
    expect((caughtError as Error).message).toBe("Unable to sign transaction");
  });
});
