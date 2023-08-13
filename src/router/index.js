import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/Home/Home.vue'; // 수정한 컴포넌트 이름 사용
import TestPage from '@/views/page/TestPage.vue'
import KoreaFood from '@/views/Menu/KoreaFood.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView, // 수정한 컴포넌트 이름 사용
  },
  {
    path : '/test',
    name : 'Test',
    component : TestPage,
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