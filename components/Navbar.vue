<script lang="ts" setup>
import { SIDEBAR_LINKS } from "~/constants/navbarLinks";
</script>

<template>
    <nav class="flex flex-col">
        <NuxtLink v-for="item in SIDEBAR_LINKS" v-slot="{ isActive }" :to="item.route" :key="item.label">
            <p class="text-white px-8 p-3 -mx-5" :class="[isActive && 'bg-blue-400 font-bold']">
                {{ item.label }}
            </p>

            <!-- <p class="text-white">
        {{ item.label.split(/\s+/)[0] }}
      </p> -->
        </NuxtLink>
    </nav>
</template>

<style scoped></style>
