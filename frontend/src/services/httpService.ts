import axios from 'axios'
import { useRouter } from 'vue-router'

// Create an Axios instance with a base URL for the backend API (localhost:3000)
export const httpClient = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true, // Include cookies in requests
  headers: {
    'Content-Type': 'application/json',
  },
})

export function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? 'Request failed'
  }
  return 'Unexpected error'
}

let isRefreshing = false
let refreshQueue: Array<() => void> = []
const router = useRouter()
httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // On ne tente le refresh que sur 401, une seule fois par requête,
    // et jamais sur la route /auth/refresh elle-même (éviter la boucle infinie).
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/refresh')
    ) {
      originalRequest._retry = true

      if (isRefreshing) {
        // Un refresh est déjà en cours (ex. plusieurs requêtes parties en même temps) :
        // on met cette requête en attente plutôt que de déclencher un 2e refresh.
        return new Promise((resolve) => {
          refreshQueue.push(() => resolve(httpClient(originalRequest)))
        })
      }

      isRefreshing = true

      try {
        await httpClient.post('/auth/refresh')
        isRefreshing = false
        refreshQueue.forEach((cb) => cb())
        refreshQueue = []
        return httpClient(originalRequest)
      } catch (refreshError) {
        isRefreshing = false
        refreshQueue = []
        // Le refresh a échoué (token expiré/révoqué) : redirection vers login.
        router.push({ name: 'login' })
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)
