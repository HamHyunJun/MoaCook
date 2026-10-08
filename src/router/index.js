import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/Home/Home.vue'; // 수정한 컴포넌트 이름 사용
import KoreaFood from '@/views/Menu/KoreaFood.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView, // 수정한 컴포넌트 이름 사용
  },
  {
    path : '/menu/koreafood',
    name : 'KoreaFood',
    component : KoreaFood,
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;