<template>
  <div class="h-screen w-screen flex flex-col">
    <Topbar />
    <div class="flex h-full">
        <LeftNavbar class="min-w-[250px] " />
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