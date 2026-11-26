<script setup>
import Icon from './Icon.vue';
import { t } from '../i18n.js';
import { CONTACTS } from '../data/site.js';
</script>

<template>
  <footer class="footer">
    <div class="container footer__inner">
      <nav class="footer__nav">
        <RouterLink to="/">{{ t('nav.home') }}</RouterLink>
        <RouterLink to="/products">{{ t('nav.products') }}</RouterLink>
        <RouterLink to="/sales">{{ t('nav.sales') }}</RouterLink>
        <RouterLink to="/reviews">{{ t('nav.reviews') }}</RouterLink>
        <RouterLink to="/contact">{{ t('nav.contact') }}</RouterLink>
      </nav>
      <div class="footer__social">
        <a :href="CONTACTS.youtube" target="_blank" rel="noopener" aria-label="YouTube"><Icon name="youtube" :size="16" /></a>
        <a :href="CONTACTS.instagram" target="_blank" rel="noopener" aria-label="Instagram"><Icon name="instagram" :size="16" /></a>
        <a :href="CONTACTS.telegramGroup" target="_blank" rel="noopener" aria-label="Telegram"><Icon name="send" :size="16" /></a>
      </div>
      <a class="footer__phone" :href="CONTACTS.phoneHref">{{ CONTACTS.phone }}</a>
      <p class="footer__copy">© {{ new Date().getFullYear() }} {{ t('footer.rights') }}</p>
    </div>
  </footer>
</template>
