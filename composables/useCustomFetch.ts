import { $fetch, type FetchOptions } from "ofetch";

export function useCustomFetch(url: string, options: FetchOptions = {}) {
  return $fetch(url, {
    ...options,
    baseURL: "https://api.realworld.io",
  });
}
