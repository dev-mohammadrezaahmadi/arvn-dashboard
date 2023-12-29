<template>
  <div class="sm:h-screen sm:overflow-hidden">
    <Topbar />
    <div class="w-full h-full flex">
        <LeftNavbar class="min-w-[250px] h-full" />
        <main class="grow">
          <slot></slot>
        </main>
    </div>

  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>