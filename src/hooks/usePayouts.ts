import useSWR from "swr";
import { fetcher } from "api";
import { useGlobalStore } from "stores/global";
import { BASE_PATH } from "consts";

export function usePayouts() {
  const userId = useGlobalStore((state) => state.userId);
  const { data, error } = useSWR(`${BASE_PATH}/api/payouts/${userId}`, fetcher);

  return {
    payouts: data,
    isLoading: !error && !data,
    isError: error,
  };
}
