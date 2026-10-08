<script setup lang="ts">
import { computed, onMounted, type ComputedRef } from 'vue'
import CardComponent from '@/components/CardElement.vue'
import { collectionStore } from '@/stores/collectionStore'
import type { SerializedCard } from '@/types/serializedCards'

interface CollectionItem {
  readonly cardId: string
  readonly card: SerializedCard
  readonly quantity: number
}

const items: ComputedRef<CollectionItem[]> = computed(() =>
  collectionStore.state.entries.flatMap((entry) => {
    const card: SerializedCard | undefined = collectionStore.state.cards[entry.cardId]
    return card === undefined ? [] : [{ cardId: entry.cardId, card, quantity: entry.quantity }]
  }),
)
const hasError: ComputedRef<boolean> = computed(() => collectionStore.state.error !== '')
const isEmpty: ComputedRef<boolean> = computed(() => items.value.length === 0)

onMounted(() => {
  void collectionStore.loadCollection()
})
</script>

<template>
  <main class="collection">
    <h1>Collection</h1>
    <p v-if="collectionStore.state.isLoading">Chargement...</p>
    <p v-else-if="hasError" class="collection__error">{{ collectionStore.state.error }}</p>
    <p v-else-if="isEmpty">Aucune carte dans la collection.</p>
    <ul v-else class="collection__grid">
      <li v-for="item in items" :key="item.cardId" class="collection__item">
        <CardComponent :card="item.card" :draggable="false" />
        <span class="collection__quantity">x{{ item.quantity }}</span>
      </li>
    </ul>
  </main>
</template>

<style scoped lang="scss">
.collection {
  padding: 1rem 1.5rem;
  color: var(--text-color);

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
    gap: 1rem;
    padding: 0;
    list-style: none;
  }

  &__item {
    position: relative;
  }

  &__quantity {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    padding: 0.1rem 0.5rem;
    border-radius: 1rem;
    background: var(--text-color);
    color: var(--light-text-color);
    font-weight: bold;
  }

  &__error {
    color: #cf0000;
  }
}
</style>
