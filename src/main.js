import { createApp } from 'vue'
import App from './App.vue'
import routers from './routers'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { useAuthStore } from '@/store/useAuthStore';

const app = createApp(App)

app.use(routers)
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

useAuthStore().initFromStorage(); // 로컬 토큰 → me 호출

app.use(pinia);
app.mount('#app')
