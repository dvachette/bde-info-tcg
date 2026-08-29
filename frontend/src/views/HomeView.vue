<script setup lang="ts">
import { useRouter } from 'vue-router'
import { userStore } from '@/stores/userStore'

const router = useRouter()

async function logout() {
  console.log('Logging out...')
  await userStore.logout()
  router.push({ name: 'login' })
}
</script>
<template>
  <h1>Home</h1>
  <button @click="logout">Logout</button>
</template>
