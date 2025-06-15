import { createApp } from 'vue';
import App from './app/login.vue';
import router from './router/index.ts';
import 'bootstrap/dist/css/bootstrap.min.css';

const app = createApp(App);

app.use(router);

app.mount('#app');
