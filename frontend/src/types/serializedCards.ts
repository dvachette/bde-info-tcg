import type {
  ArenaInterface,
  MemberInterface,
  PetInterface,
} from '../../../shared/types/cards'

export type SerializedMember = Omit<MemberInterface, 'attack'>
export type SerializedCard = PetInterface | SerializedMember | ArenaInterface
