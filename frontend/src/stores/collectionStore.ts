import { reactive, shallowReadonly } from 'vue'
import type { SerializedCard } from '@/types/serializedCards'
import type { CollectionEntry } from '@/types/collection'
import { useCardService } from '@/services/cardService'
import { useCollectionService } from '@/services/collectionService'

interface CollectionState {
  entries: CollectionEntry[]
  cards: Record<string, SerializedCard>
  isLoading: boolean
  error: string
}

const cardService = useCardService()
const collectionService = useCollectionService()

const state = reactive<CollectionState>({
  entries: [],
  cards: {},
  isLoading: false,
  error: '',
})

async function loadCollection(): Promise<boolean> {
  state.isLoading = true
  state.error = ''

  const [cardsResult, collectionResult] = await Promise.all([
    cardService.getCards(),
    collectionService.getCollection(),
  ])

  state.isLoading = false
  if (cardsResult.cards === undefined || collectionResult.entries === undefined) {
    state.error = cardsResult.message || collectionResult.message
    return false
  }
  state.cards = cardsResult.cards
  state.entries = collectionResult.entries
  return true
}

function clearCollection(): void {
  state.entries = []
  state.cards = {}
  state.error = ''
}


async function ensureCatalog(): Promise<boolean> {
  if (Object.keys(state.cards).length > 0) {
    return true
  }
  const result = await cardService.getCards()
  if (result.cards === undefined) {
    state.error = result.message
    return false
  }
  state.cards = result.cards
  return true
}
export const collectionStore = {
  state: shallowReadonly(state),
  loadCollection,
  clearCollection,
  ensureCatalog
}
