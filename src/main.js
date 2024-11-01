import { createApp } from 'vue'
import App from './App.vue'
import routers from './routers' 
import { createPinia } from 'pinia'

const app = createApp(App)

app.use(routers)
app.use(createPinia())

app.mount('#app')
