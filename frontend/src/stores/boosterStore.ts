import { reactive, shallowReadonly } from 'vue'
import type { OpenedBooster } from '@/types/booster'
import { useBoosterService } from '@/services/boosterService'
import { collectionStore } from '@/stores/collectionStore'

interface BoosterState {
  current: OpenedBooster | null
  pendingCount: number
  canOpen: boolean
  isProcessing: boolean
}

const boosterService = useBoosterService()

const state = reactive<BoosterState>({
  current: null,
  pendingCount: 0,
  canOpen: false,
  isProcessing: false,
})

let resolveDismiss: (() => void) | null = null
let epoch = 0

function setCanOpen(value: boolean): void {
  state.canOpen = value
}

function waitForDismiss(): Promise<void> {
  return new Promise<void>((resolve) => {
    resolveDismiss = resolve
  })
}

function dismissCurrent(): void {
  if (resolveDismiss !== null) {
    resolveDismiss()
    resolveDismiss = null
  }
}

async function openAndReveal(): Promise<boolean> {
  const result = await boosterService.openNext()
  if (result.booster === undefined) {
    return false
  }
  state.pendingCount = Math.max(0, state.pendingCount - 1)
  state.current = result.booster
  await waitForDismiss()
  state.current = null
  return true
}

async function processQueue(): Promise<void> {
  if (state.isProcessing) {
    return
  }
  state.isProcessing = true
  const startEpoch: number = epoch
  try {
    if (!(await collectionStore.ensureCatalog())) {
      return
    }
    while (state.canOpen && startEpoch === epoch) {
      if (!(await openAndReveal()) || startEpoch !== epoch) {
        return
      }
      await collectionStore.loadCollection()
    }
  } finally {
    state.isProcessing = false
  }
}

async function refresh(): Promise<void> {
  if (!state.canOpen || state.isProcessing) {
    return
  }
  const result = await boosterService.getPending()
  state.pendingCount = result.entries?.length ?? 0
  if (state.pendingCount > 0) {
    await processQueue()
  }
}

function clearBoosters(): void {
  epoch++
  state.current = null
  state.pendingCount = 0
  dismissCurrent()
}

export const boosterStore = {
  state: shallowReadonly(state),
  setCanOpen,
  refresh,
  dismissCurrent,
  clearBoosters,
}
