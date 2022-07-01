import useSWR from "swr";
import { fetcher } from "api";
import { useGlobalStore } from "stores/global";
import { BASE_PATH } from "consts";

export function useEmployments() {
  const userId = useGlobalStore((state) => state.userId);
  const { data, error } = useSWR(
    `${BASE_PATH}/api/employments/${userId}`,
    fetcher
  );

  return {
    employments: data,
    isLoading: !error && !data,
    isError: error,
  };
}
