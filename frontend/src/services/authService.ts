import type { User } from '@/types/user'
import { extractErrorMessage, httpClient } from './httpService'
import axios from 'axios'
const authUrlPrefix = '/auth/'

async function register(
  username: string,
  email: string,
  password: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await httpClient.post(authUrlPrefix + 'register', {
      username,
      email,
      password,
    })
    return { success: response.status === 201, message: response.data.message }
  } catch (error) {
    return { success: false, message: extractErrorMessage(error) }
  }
}

async function login(
  identifier: string,
  password: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await httpClient.post(authUrlPrefix + 'login', { identifier, password })
    return { success: response.status === 200, message: response.data.message }
  } catch (error) {
    return { success: false, message: extractErrorMessage(error) }
  }
}

async function me(): Promise<{ success: boolean; message: string; user?: User }> {
  try {
    const response = await httpClient.get(authUrlPrefix + 'me')
    if (!response.data.user) {
      return { success: false, message: 'User not found' }
    }
    return { success: true, message: response.data.message, user: response.data.user }
  } catch (error) {
    return { success: false, message: extractErrorMessage(error) }
  }
}

async function logout(): Promise<{ success: boolean; message: string }> {
  try {
    const response = await httpClient.post(authUrlPrefix + 'logout')
    return { success: response.status === 200, message: response.data.message }
  } catch (error) {
    return { success: false, message: extractErrorMessage(error) }
  }
}

export function useAuthService() {
  return {
    register,
    login,
    me,
    logout,
  }
}
