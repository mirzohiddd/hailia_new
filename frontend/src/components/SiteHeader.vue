<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import Icon from './Icon.vue';
import { t, lang, setLang } from '../i18n.js';
import { isDark, toggleTheme } from '../theme.js';

const route = useRoute();
const open = ref(false);
watch(() => route.fullPath, () => (open.value = false));

const links = [
  { to: '/', key: 'nav.home' },
  { to: '/products', key: 'nav.products' },
  { to: '/sales', key: 'nav.sales' },
  { to: '/reviews', key: 'nav.reviews' },
  { to: '/contact', key: 'nav.contact' }
];
</script>

<template>
  <header class="header">
    <div class="container header__inner">
      <RouterLink to="/" class="header__logo" aria-label="Halila">
        <img src="/img/logo.png" alt="HALILA" width="272" height="66" />
      </RouterLink>

      <nav class="nav" :class="{ 'nav--open': open }">
        <RouterLink
          v-for="l in links"
          :key="l.to"
          :to="l.to"
          class="nav__link"
          :class="{ 'nav__link--active': route.path === l.to }"
        >
          {{ t(l.key) }}
        </RouterLink>
        <RouterLink to="/ariza" class="btn btn--green nav__apply-mobile">
          <Icon name="pencil" :size="18" />
          {{ t('nav.apply') }}
        </RouterLink>
      </nav>

      <div class="header__actions">
        <RouterLink to="/ariza" class="btn btn--green header__apply">
          <Icon name="pencil" :size="18" />
          {{ t('nav.apply') }}
        </RouterLink>
        <div class="lang" role="group" aria-label="Til">
          <button type="button" :class="{ active: lang === 'uz' }" @click="setLang('uz')">UZ</button>
          <button type="button" :class="{ active: lang === 'ru' }" @click="setLang('ru')">RU</button>
        </div>
        <button type="button" class="icon-btn" :aria-label="t('nav.theme')" @click="toggleTheme">
          <span v-if="!isDark" class="moon">☾</span>
          <Icon v-else name="sun" :size="18" />
        </button>
        <button
          type="button"
          class="icon-btn burger"
          :aria-label="t('nav.menu')"
          :aria-expanded="open"
          @click="open = !open"
        >
          <Icon :name="open ? 'close' : 'menu'" :size="20" />
        </button>
      </div>
    </div>
  </header>
</template>
