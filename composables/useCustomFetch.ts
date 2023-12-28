import { $fetch, type FetchOptions } from "ofetch";
import Keys from "~/constants/Keys";

export function useCustomFetch(url: string, options: FetchOptions = {}) {
  const token = useCookie(Keys.AUTH_TOKEN);

  return $fetch(url, {
    ...options,
    baseURL: "https://api.realworld.io",
    onRequest({ options }) {
      if (token.value) {
        options.headers = {
          ...options.headers,
          authorization: `Bearer ${token.value}`,
        };
      }
    },
    onResponseError({ response }) {
      return Promise.reject(response._data);
    },
  });
}
