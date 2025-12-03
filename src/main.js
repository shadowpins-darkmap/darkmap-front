import { createApp } from 'vue';
import App from './App.vue';
import routers from './routers';
import pinia from './store';

const app = createApp(App);

app.use(pinia);
app.use(routers);
app.mount('#app');
