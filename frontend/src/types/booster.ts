export interface PendingBoosterEntry {
  readonly id: string
  readonly boosterId: string
}

export interface OpenedCard {
  readonly cardId: string
  readonly isNew: boolean
}

export interface OpenedBooster {
  readonly boosterId: string
  readonly cards: OpenedCard[]
}
