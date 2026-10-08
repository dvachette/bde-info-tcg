<script setup lang="ts">
import { computed, watch, type ComputedRef } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import { userStore } from './stores/userStore'
import { boosterStore } from './stores/boosterStore'
import BoosterOverlay from './components/BoosterOverlay.vue'

const route = useRoute()
const showNav: ComputedRef<boolean> = computed(
  () => route.name !== undefined && route.meta.public !== true,
)

const canOpenBoosters: ComputedRef<boolean> = computed(
  () =>
    userStore.state.isAuthenticated &&
    route.name !== undefined &&
    route.meta.public !== true &&
    route.meta.blocksBoosterOpening !== true,
)

watch(
  [() => route.fullPath, canOpenBoosters],
  () => {
    boosterStore.setCanOpen(canOpenBoosters.value)
    void boosterStore.refresh()
  },
  { immediate: true },
)
</script>

<template>
  <div class="app">
    <NavBar v-if="showNav" />
    <router-view />
    <BoosterOverlay />
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
