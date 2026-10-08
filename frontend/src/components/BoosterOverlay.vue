<script setup lang="ts">
import { computed, ref, watch, type ComputedRef, type Ref } from 'vue'
import CardComponent from '@/components/CardElement.vue'
import CardStack from '@/components/CardStack.vue'
import { boosterStore } from '@/stores/boosterStore'
import { collectionStore } from '@/stores/collectionStore'
import type { OpenedBooster, OpenedCard } from '@/types/booster'
import type { SerializedCard } from '@/types/serializedCards'

type Phase = 'pack' | 'reveal'

interface RevealCard {
  readonly id: number
  readonly card: SerializedCard
  readonly isNew: boolean
}

const phase: Ref<Phase> = ref('pack')
const sentCount: Ref<number> = ref(0)

const booster: ComputedRef<OpenedBooster | null> = computed(() => boosterStore.state.current)

const revealCards: ComputedRef<RevealCard[]> = computed(() => {
  const current: OpenedBooster | null = booster.value
  if (current === null) {
    return []
  }
  const cards: RevealCard[] = current.cards.flatMap((entry: OpenedCard, index: number) => {
    const card: SerializedCard | undefined = collectionStore.state.cards[entry.cardId]
    return card === undefined ? [] : [{ id: index, card, isNew: entry.isNew }]
  })
  return cards.reverse()
})

const total: ComputedRef<number> = computed(() => revealCards.value.length)
const seenCount: ComputedRef<number> = computed(() => Math.min(sentCount.value + 1, total.value))
const allSeen: ComputedRef<boolean> = computed(() => sentCount.value >= total.value - 1)

function openPack(): void {
  phase.value = 'reveal'
}

function onSent(): void {
  sentCount.value++
}

function dismiss(): void {
  boosterStore.dismissCurrent()
}

watch(booster, () => {
  phase.value = 'pack'
  sentCount.value = 0
})
</script>

<template>
  <div v-if="booster !== null" class="booster-overlay" role="dialog" aria-modal="true">
    <button v-if="phase === 'pack'" class="booster-overlay__pack" type="button" @click="openPack">
      Ouvrir
    </button>
    <template v-else>
      <div class="booster-overlay__stack">
        <CardStack :cards="revealCards" @sent="onSent">
          <template #default="{ card }">
            <div class="booster-overlay__card">
              <CardComponent :card="card.card" :draggable="false" />
              <span v-if="card.isNew" class="booster-overlay__badge">Nouvelle !</span>
            </div>
          </template>
        </CardStack>
      </div>
      <p class="booster-overlay__counter">{{ seenCount }} / {{ total }}</p>
      <button
        class="booster-overlay__continue"
        type="button"
        :disabled="!allSeen"
        @click="dismiss"
      >
        Continuer
      </button>
    </template>
  </div>
</template>

<style scoped lang="scss">
.booster-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  background: rgba(0, 0, 0, 0.85);
  color: var(--light-text-color);

  &__pack {
    width: min(14rem, 60vw);
    aspect-ratio: 1 / 1.618;
    border: none;
    border-radius: 5% / 3.1%;
    background: var(--background-color);
    color: var(--text-color);
    font-size: 1.25rem;
    font-weight: 700;
    cursor: pointer;
    transition: transform 0.2s ease-in-out;

    &:hover {
      transform: scale(1.03);
    }
  }

  &__stack {
    width: min(18rem, 70vw);
    aspect-ratio: 1 / 1.618;
  }

  &__card {
    position: relative;
    width: 100%;
  }

  &__badge {
    position: absolute;
    top: 0.5rem;
    left: 0.5rem;
    padding: 0.1rem 0.6rem;
    border-radius: 1rem;
    background: var(--text-color);
    color: var(--light-text-color);
    font-weight: 700;
  }

  &__counter {
    margin: 0;
  }

  &__continue {
    padding: 0.5rem 1.5rem;
    border: none;
    border-radius: 4px;
    background: var(--background-color);
    color: var(--text-color);
    font-weight: 700;
    cursor: pointer;

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }
}
</style>
