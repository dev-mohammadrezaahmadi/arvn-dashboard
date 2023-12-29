<script lang="ts" setup>
import { SIDEBAR_LINKS } from "~/constants/navbarLinks";
</script>

<template>
    <nav class="w-full flex justify-evenly bg-blue-600">
        <NuxtLink v-for="item in SIDEBAR_LINKS" v-slot="{ isActive }" :to="item.route" :key="item.label">
            <div class="p-3">
                <UIcon v-if="isActive" class="text-white text-2xl" :name="item.activeIcon" />
                <UIcon v-else  class="text-white text-2xl" :name="item.inactiveIcon" />
            </div>
            <!-- <p class="text-white">
        {{ item.label.split(/\s+/)[0] }}
      </p> -->
        </NuxtLink>
    </nav>
</template>

<style scoped></style>
