import { useCallback, useEffect, useState } from "react";
import { useWallet } from "./useWallet";
import { fetchBalance, type Balance } from "../util/wallet";

const formatter = new Intl.NumberFormat();

const checkFunding = (balances: Balance[]) =>
  balances.some(({ balance }) =>
    !Number.isNaN(Number(balance)) ? Number(balance) > 0 : false,
  );

type WalletBalance = {
  balances: Balance[];
  xlm: string;
  isFunded: boolean;
  isLoading: boolean;
  error: Error | null;
  usdc: string;
};

export const useWalletBalance = () => {
  const { address } = useWallet();
  const [state, setState] = useState<WalletBalance>({
    balances: [],
    xlm: "-",
    usdc: "-",
    isFunded: false,
    isLoading: false,
    error: null,
  });

  const updateBalance = useCallback(async () => {
    if (!address) return;
    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      const balances = await fetchBalance(address);
      const isFunded = checkFunding(balances);
      // @ts-expect-error asset_code exists though
      const usdc = balances.find((asset) => asset?.asset_code === "USDC");
      const native = balances.find(({ asset_type }) => asset_type === "native");
      setState({
        isLoading: false,
        balances,
        xlm: native?.balance ? formatter.format(Number(native.balance)) : "-",
        usdc: usdc?.balance ? formatter.format(Number(usdc.balance)) : "-",
        isFunded,
        error: null,
      });
    } catch (err) {
      if (err instanceof Error && err.message.match(/not found/i)) {
        setState({
          isLoading: false,
          balances: [],
          xlm: "-",
          usdc: "-",
          isFunded: false,
          error: new Error("Error fetching balance. Is your wallet funded?"),
        });
      } else {
        console.error(err);
        setState({
          isLoading: false,
          balances: [],
          xlm: "-",
          usdc: "-",
          isFunded: false,
          error: new Error("Unknown error fetching balance."),
        });
      }
    }
  }, [address]);

  useEffect(() => {
    void updateBalance();
  }, [updateBalance]);

  return {
    ...state,
    updateBalance,
  };
};
