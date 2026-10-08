<script setup lang="ts">
interface NavItem {
  readonly name: string
  readonly label: string
}

const NAV_ITEMS: readonly NavItem[] = [
  { name: 'home', label: 'Accueil' },
  { name: 'collection', label: 'Collection' },
  { name: 'match', label: 'Match' },
  { name: 'shop', label: 'Boutique' },
  { name: 'social', label: 'Social' },
  { name: 'settings', label: 'Paramètres' },
]
</script>

<template>
  <nav class="navbar">
    <RouterLink
      v-for="item in NAV_ITEMS"
      :key="item.name"
      :to="{ name: item.name }"
      class="navbar__link"
    >
      {{ item.label }}
    </RouterLink>
  </nav>
</template>

<style scoped lang="scss">
.navbar {
  display: flex;
  gap: 1.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--background-color);

  &__link {
    color: var(--text-color);
    font-weight: 600;
    text-decoration: none;
    border-bottom: 2px solid transparent;

    &.router-link-active {
      border-bottom-color: var(--text-color);
    }
  }
}
</style>
