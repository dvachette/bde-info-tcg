import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './constants/colors.scss'
const app = createApp(App)

app.use(router)

app.mount('#app')
