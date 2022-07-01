import useSWR from "swr";
import { supabase } from "supabaseClient";
import { getCookie, setCookies } from "cookies-next";
import { v4 as uuidv4 } from "uuid";
import { BASE_PATH } from "consts";

export function useConfig() {
  const { data, error } = useSWR(
    `${BASE_PATH}/config`,
    async () => {
      const cookie = getCookie("argyle-x-session");

      if (!cookie) {
        const nextCookie = uuidv4();

        const { data } = await supabase
          .from("config")
          .insert([{ id: nextCookie }])
          .single();

        setCookies("argyle-x-session", nextCookie, { maxAge: 60 * 6 * 24 });

        return data;
      }

      const { data } = await supabase
        .from("config")
        .select()
        .eq("id", cookie)
        .single();

      return data;
    },
    { revalidateOnFocus: false, revalidateOnReconnect: false }
  );

  return {
    config: data,
    isConfigLoading: !error && !data,
    isError: error,
  };
}
