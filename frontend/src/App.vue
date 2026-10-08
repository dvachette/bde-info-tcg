<script setup lang="ts">
import { computed, type ComputedRef } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from '@/components/NavBar.vue'

const route = useRoute()
const showNav: ComputedRef<boolean> = computed(
  () => route.name !== undefined && route.meta.public !== true,
)
</script>

<template>
  <div class="app">
    <NavBar v-if="showNav" />
    <router-view />
  </div>
</template>

<style>
body {
  height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
}
</style>

<style scoped lang="scss">
.app {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}
</style>
