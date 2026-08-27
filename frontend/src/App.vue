<script setup lang="ts">
</script>

<template>
  <router-view />
</template>

<style scoped>
  .cards {
    display:grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1rem;
  }
</style>
