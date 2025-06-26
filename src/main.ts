import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index.ts';
import 'bootstrap/dist/css/bootstrap.min.css';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

const app = createApp(App);

app.use(Toast, {

  transition: "Vue-Toastification__bounce",
  maxToasts: 3,
  newestOnTop: true
})
app.use(router);

app.mount('#app');
