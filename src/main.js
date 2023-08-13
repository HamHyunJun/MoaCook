import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // router를 import하는 부분을 올바르게 수정

createApp(App)
  .use(router) // Vue 3에서는 use() 메서드를 사용하여 플러그인을 등록합니다.
  .mount('#app');