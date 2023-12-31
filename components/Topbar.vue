<script setup lang="ts">
import { useUserStore } from "~/stores/user";

const userStore = useUserStore();
const router = useRouter();

function handleLogout() {
    userStore.logout();
    router.push("/");
}
</script>

<template>
    <div class="topbar bg-gray-400 flex justify-between items-center p-4 text-white">
        <div class="flex items-baseline">
            <p class="capitalize text-2xl hidden sm:block">arvan challenge</p>
            <p class="ml-4 capitalize">
                welcome {{ userStore.currentUser?.username }}
            </p>
        </div>
        <div class="">
            <UButton @click="handleLogout" variant="outline" color="red" label="Logout" />
        </div>
    </div>
</template>

<style scoped></style>
