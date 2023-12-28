import * as AuthService from "~/services/auth";
import Keys from "~/constants/Keys";
import type { User, UserInfo } from "~/types";

export const useUserStore = defineStore("user", () => {
  const token = useCookie(Keys.AUTH_TOKEN);
  const currentUser = ref<UserInfo | null>(null);
  const isLoggedIn = computed(() => currentUser.value !== null);

  function setUserInfo(user: UserInfo) {
    currentUser.value = user;
    token.value = user.token;
  }

  async function register(params: { user: User }) {
    const data = await AuthService.register(params);
    setUserInfo(data.user);
  }

  async function login(params: { user: User }) {
    const data = await AuthService.login(params);
    setUserInfo(data.user);
  }

  return {
    register,
    login,
    isLoggedIn
  };
});
