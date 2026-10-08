export type UserRole = 'PLAYER' | 'ADMIN'

export interface User {
  id: string
  username: string
  email: string
  role: UserRole
  keysBalance: number
}
