import type { SerializedCard } from '@/types/serializedCards'
import { extractErrorMessage, httpClient } from './httpService'

const cardUrlPrefix = '/cards'

async function getCards(): Promise<{
  success: boolean
  message: string
  cards?: Record<string, SerializedCard>
}> {
  try {
    const response = await httpClient.get<Record<string, SerializedCard>>(cardUrlPrefix)
    return { success: true, message: '', cards: response.data }
  } catch (error) {
    return { success: false, message: extractErrorMessage(error) }
  }
}

export function useCardService() {
  return { getCards }
}
