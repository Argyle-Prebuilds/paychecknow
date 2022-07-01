import useSWR from "swr";
import { fetcher } from "api";
import { useGlobalStore } from "stores/global";
import { Profile } from "models/profile";
import { BASE_PATH } from "consts";

export function useProfile() {
  const userId = useGlobalStore((state) => state.userId);
  const { data, error } = useSWR(`${BASE_PATH}/api/profile/${userId}`, fetcher);

  return {
    profile: data as Profile,
    isLoading: !error && !data,
    error: error,
  };
}
