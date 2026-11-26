import { createApp } from 'vue';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/800.css';
import './styles/main.css';
import App from './App.vue';
import router from './router.js';
import { lang } from './i18n.js';

document.documentElement.lang = lang.value;
createApp(App).use(router).mount('#app');
