import useSWR from "swr";
import { fetcher } from "api";
import { useGlobalStore } from "stores/global";
import { formatSnakeCase, groupBy } from "utils";
import { BASE_PATH } from "consts";

function refineData(data: any) {
  if (!data) {
    return {};
  }

  const refined = data.map((allocation: any) => {
    return {
      ...allocation,
      employerC: formatSnakeCase(allocation.employer),
    };
  });

  const grouped = groupBy(refined, (allocation: any) => allocation.employer);

  return grouped;
}

export function usePayAllocations(explicitUserId?: string) {
  const globalUserId = useGlobalStore((state) => state.userId);
  const userId = explicitUserId || globalUserId;
  const { data, error } = useSWR(
    `${BASE_PATH}/api/pay-allocations/${userId}`,
    fetcher
  );

  const refinedData = refineData(data);

  return {
    payAllocations: refinedData,
    isLoading: !error && !data,
    error: error,
  };
}
