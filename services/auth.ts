import type { User, UserInfo } from "~/types";

function register(params: { user: User }): Promise<{ user: UserInfo }> {
  return useCustomFetch("/api/users", {
    method: "POST",
    body: params,
  });
}

export { register };
