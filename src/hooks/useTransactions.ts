import useSWR from "swr";
import { fetcher } from "api";
import { BASE_PATH } from "consts";

export function useTransactions(unitAccountId?: string) {
  const { data, error, mutate } = useSWR(
    () => `${BASE_PATH}/api/unit/transactions/${unitAccountId}`,
    fetcher
  );

  return {
    transactions: data?.data,
    isLoading: !error && !data,
    error: error,
    mutate: mutate,
  };
}
