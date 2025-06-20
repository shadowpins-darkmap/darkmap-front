import { createApp } from 'vue'
import App from './App.vue'
import routers from './routers'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const app = createApp(App)

app.use(routers)
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia);
app.mount('#app')
