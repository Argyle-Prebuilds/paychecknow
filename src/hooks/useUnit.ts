import useSWR from "swr";
import { fetcher } from "api";
import { useGlobalStore } from "stores/global";
import { BASE_PATH } from "consts";

export function useUnit(explicitUserId?: string) {
  const userId = explicitUserId || useGlobalStore((state) => state.userId);
  const { data, error, mutate } = useSWR(
    () => `${BASE_PATH}/api/unit/${userId}`,
    fetcher
  );

  return {
    unit: data,
    isLoading: !error && !data,
    error: error,
    mutate: mutate,
  };
}
