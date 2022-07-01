import useSWR from "swr";
import { fetcher } from "api";
import { useGlobalStore } from "stores/global";
import qs from "qs";
import { BASE_PATH } from "consts";

type Decision = {
  approved: boolean;
  durations: number[];
  monthly: number;
  combined: {
    initial: number;
    daily: number;
  };
  criteria: {
    duration: boolean;
    pay: boolean;
  };
  payouts: Record<string, { initial: number; daily: number }>;
};

type useEarlyPayProps = {
  activeAccounts: string[];
};

export function useEarlyPay({ activeAccounts }: useEarlyPayProps) {
  const params = qs.stringify({ a: activeAccounts });

  const userId = useGlobalStore((state) => state.userId);
  const { data, error, mutate } = useSWR(
    `${BASE_PATH}/api/early/${userId}?${params}`,
    fetcher
  );

  return {
    data: data as Decision,
    isLoading: !error && !data,
    isError: error,
    mutate: mutate,
  };
}
