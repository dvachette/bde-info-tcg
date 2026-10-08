import type { CollectionEntry } from '@/types/collection'
import { extractErrorMessage, httpClient } from './httpService'

const collectionUrlPrefix = '/collection'

async function getCollection(): Promise<{
  success: boolean
  message: string
  entries?: CollectionEntry[]
}> {
  try {
    const response = await httpClient.get<CollectionEntry[]>(collectionUrlPrefix)
    return { success: true, message: '', entries: response.data }
  } catch (error) {
    return { success: false, message: extractErrorMessage(error) }
  }
}

export function useCollectionService() {
  return { getCollection }
}
