import { useUserStore } from "~/stores/user";
import Keys from '~/constants/Keys'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const token = useCookie(Keys.AUTH_TOKEN)

  const userStore = useUserStore();

  if (!token) return;
  if (!userStore.currentUser) {
    try {
      await userStore.getUserInfo();
    } catch (error) {
      console.error(error);
    }
  }
});
