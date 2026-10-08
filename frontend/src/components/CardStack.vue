<script setup lang="ts" generic="T extends { id: number }">
import type { PanInfo } from 'motion-v'
import { Motion, useMotionValue, useTransform } from 'motion-v'
import { onBeforeMount, ref, shallowRef, watch, type Ref, type ShallowRef } from 'vue'

const props = withDefaults(
  defineProps<{
    cards: readonly T[]
    randomRotation?: boolean
    sensitivity?: number
    stiffness?: number
    damping?: number
  }>(),
  {
    randomRotation: true,
    sensitivity: 180,
    stiffness: 260,
    damping: 20,
  },
)

const emit = defineEmits<{
  (e: 'sent', id: number): void
}>()

type MotionValue = ReturnType<typeof useMotionValue<number>>
type TransformValue = ReturnType<typeof useTransform<number, number>>

interface CardState {
  readonly x: MotionValue
  readonly y: MotionValue
  readonly rotateX: TransformValue
  readonly rotateY: TransformValue
  readonly reset: () => void
}

const STEP_ROTATION_DEG = 4
const STEP_SCALE = 0.06
const MAX_RANDOM_ROTATION_DEG = 5

const stack: ShallowRef<T[]> = shallowRef<T[]>([...props.cards])
const rotations: Ref<Record<number, number>> = ref<Record<number, number>>({})
const cardStates: Map<number, CardState> = new Map<number, CardState>()

function pickRotation(): number {
  if (!props.randomRotation) {
    return 0
  }
  return Math.random() * 2 * MAX_RANDOM_ROTATION_DEG - MAX_RANDOM_ROTATION_DEG
}

function createCardState(): CardState {
  const x: MotionValue = useMotionValue(0)
  const y: MotionValue = useMotionValue(0)
  const rotateX: TransformValue = useTransform(y, [-100, 100], [60, -60])
  const rotateY: TransformValue = useTransform(x, [-100, 100], [-60, 60])
  return {
    x,
    y,
    rotateX,
    rotateY,
    reset: (): void => {
      x.set(0)
      y.set(0)
    },
  }
}

function getCardState(id: number): CardState {
  const existing: CardState | undefined = cardStates.get(id)
  if (existing !== undefined) {
    return existing
  }
  const created: CardState = createCardState()
  cardStates.set(id, created)
  return created
}

function initCards(): void {
  stack.value.forEach((card: T) => {
    getCardState(card.id)
    rotations.value[card.id] = pickRotation()
  })
}

function rotationOf(index: number, id: number): number {
  return (stack.value.length - index - 1) * STEP_ROTATION_DEG + (rotations.value[id] ?? 0)
}

function scaleOf(index: number): number {
  return 1 + index * STEP_SCALE - stack.value.length * STEP_SCALE
}

function isTop(id: number): boolean {
  return stack.value[stack.value.length - 1]?.id === id
}

function sendToBack(id: number): void {
  if (!isTop(id)) {
    return
  }
  const next: T[] = [...stack.value]
  const card: T | undefined = next.pop()
  if (card === undefined) {
    return
  }
  next.unshift(card)
  rotations.value[card.id] = pickRotation()
  stack.value = next
  emit('sent', card.id)
}

function handleDragEnd(info: PanInfo, id: number): void {
  const farEnough: boolean =
    Math.abs(info.offset.x) > props.sensitivity || Math.abs(info.offset.y) > props.sensitivity
  if (farEnough && isTop(id)) {
    sendToBack(id)
  } else {
    getCardState(id).reset()
  }
}

onBeforeMount(initCards)

watch(
  () => props.cards,
  (next: readonly T[]) => {
    stack.value = [...next]
    initCards()
  },
)
</script>

<template>
  <div class="card-stack">
    <template v-for="(card, index) in stack" :key="card.id">
      <Motion
        as="div"
        class="card-stack__drag"
        :style="{
          x: getCardState(card.id).x,
          y: getCardState(card.id).y,
          rotateX: getCardState(card.id).rotateX,
          rotateY: getCardState(card.id).rotateY,
        }"
        drag
        :drag-constraints="{ top: 0, right: 0, bottom: 0, left: 0 }"
        :drag-elastic="0.6"
        :while-tap="{ cursor: 'grabbing' }"
        :on-drag-end="(_: PointerEvent, info: PanInfo) => handleDragEnd(info, card.id)"
      >
        <Motion
          as="div"
          class="card-stack__item"
          :animate="{
            rotateZ: rotationOf(index, card.id),
            scale: scaleOf(index),
            transformOrigin: '90% 90%',
          }"
          :initial="false"
          :transition="{ type: 'spring', stiffness, damping }"
          @click="sendToBack(card.id)"
        >
          <slot :card="card" :index="index" />
        </Motion>
      </Motion>
    </template>
  </div>
</template>

<style scoped lang="scss">
.card-stack {
  position: relative;
  width: 100%;
  height: 100%;
  perspective: 600px;

  &__drag {
    position: absolute;
    width: 100%;
    height: 100%;
    cursor: grab;
  }

  &__item {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
}
</style>
