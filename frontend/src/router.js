import { createRouter, createWebHistory } from 'vue-router';
import HomeView from './views/HomeView.vue';
import ProductsView from './views/ProductsView.vue';
import SalesView from './views/SalesView.vue';
import ReviewsView from './views/ReviewsView.vue';
import ContactView from './views/ContactView.vue';
import ArizaView from './views/ArizaView.vue';
import NotFoundView from './views/NotFoundView.vue';
import { t } from './i18n.js';

// Original saytdagi .html manzillar ham ishlaydi (alias)
const routes = [
  { path: '/', component: HomeView, alias: '/index.html', meta: { title: 'Halila — Mahsulotlar va sharhlar' } },
  { path: '/products', component: ProductsView, alias: '/products.html', meta: { title: 'Halila — Mahsulotlar' } },
  { path: '/sales', component: SalesView, alias: '/sales.html', meta: { title: 'Halila — Tariflar' } },
  { path: '/reviews', component: ReviewsView, alias: '/reviews.html', meta: { title: 'Halila — Mijozlar sharhlari' } },
  { path: '/contact', component: ContactView, alias: '/contact.html', meta: { title: 'Halila — Aloqa' } },
  { path: '/ariza', component: ArizaView, alias: '/ariza.html', meta: { title: 'Halila — Ariza qoldirish' } },
  { path: '/:pathMatch(.*)*', component: NotFoundView, meta: { title: 'Halila — 404' } }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
});

router.afterEach((to) => {
  document.title = to.meta.title || 'Halila';
});

export default router;
