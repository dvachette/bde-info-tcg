import axios from 'axios'
import type { OpenedBooster, PendingBoosterEntry } from '@/types/booster'
import { extractErrorMessage, httpClient } from './httpService'

const boosterUrlPrefix = '/boosters'

async function getPending(): Promise<{
  success: boolean
  message: string
  entries?: PendingBoosterEntry[]
}> {
  try {
    const response = await httpClient.get<PendingBoosterEntry[]>(boosterUrlPrefix + '/pending')
    return { success: true, message: '', entries: response.data }
  } catch (error) {
    return { success: false, message: extractErrorMessage(error) }
  }
}

async function openNext(): Promise<{
  success: boolean
  message: string
  booster?: OpenedBooster
}> {
  try {
    const response = await httpClient.post<OpenedBooster>(boosterUrlPrefix + '/open')
    return { success: true, message: '', booster: response.data }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return { success: true, message: 'No pending booster' }
    }
    return { success: false, message: extractErrorMessage(error) }
  }
}

export function useBoosterService() {
  return { getPending, openNext }
}
