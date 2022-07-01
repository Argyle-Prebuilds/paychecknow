import useSWR from "swr";
import { fetcher } from "api";
import { useGlobalStore } from "stores/global";
import { BASE_PATH, colors } from "consts";

function withColors(accounts) {
  return accounts?.map((account, index) => ({
    ...account,
    color: colors[index],
  }));
}

export function useAccounts() {
  const userId = useGlobalStore((state) => state.userId);
  const { data, error, mutate } = useSWR(
    `${BASE_PATH}/api/accounts/${userId}`,
    fetcher
  );

  const connected = data?.filter(
    (account) => account.was_connected && account.status !== "error"
  );

  const isPdConfigured = connected?.every(
    (account) => account.pay_distribution.status === "success"
  );

  return {
    accounts: withColors(connected),
    isPdConfigured: isPdConfigured,
    isLoading: !error && !data,
    isError: error,
    mutate: mutate,
  };
}
