<template>
  <div class="sm:h-screen w-screen flex flex-col">
    <Topbar />
    <MobileViewNavbar class="flex w-full sm:hidden" />
    <div class="flex h-full">
        <LeftNavbar class="hidden sm:block min-w-[250px] " />
        <main class="flex-grow overflow-hidden">
          <slot></slot>
        </main>
    </div>

  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>