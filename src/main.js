// src/main.js
import { createApp } from 'vue'
import App from './App.vue'

const modules = []
const files = import.meta.glob('./modules/*.js', { eager: true })
for (const path in files) {
  if (files[path].default) modules.push(files[path].default)
}

const app = createApp(App)

// Suppose que tu passes la scene Three.js dans un provide ou contexte partagé
app.config.globalProperties.$modules = modules

app.mount('#app')
