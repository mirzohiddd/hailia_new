<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import PageHead from '../components/PageHead.vue';
import Icon from '../components/Icon.vue';
import { t } from '../i18n.js';
import { CONTACTS } from '../data/site.js';

const route = useRoute();
// Tanlangan mahsulot arizaga uzatiladi
const arizaLink = computed(() => ({
  path: '/ariza',
  query: route.query.mahsulot ? { mahsulot: route.query.mahsulot } : {}
}));
</script>

<template>
  <PageHead :badge="t('contactPage.badge')" :title="t('contactPage.title')" :sub="t('contactPage.sub')" />
  <section class="section section--page section--contact">
    <div class="container contact">
      <div class="contact__info">
        <h2 class="contact__title">{{ t('contactPage.info') }}</h2>
        <ul class="contact__list">
          <li>
            <span class="contact__icon"><Icon name="phone" :size="16" /></span>
            <div><small>{{ t('contactPage.phone') }}</small><a :href="CONTACTS.phoneHref">{{ CONTACTS.phone }}</a></div>
          </li>
          <li>
            <span class="contact__icon"><Icon name="youtube" :size="16" /></span>
            <div><small>YouTube</small><a :href="CONTACTS.youtube" target="_blank" rel="noopener">{{ CONTACTS.youtubeLabel }}</a></div>
          </li>
          <li>
            <span class="contact__icon"><Icon name="instagram" :size="16" /></span>
            <div><small>Instagram</small><a :href="CONTACTS.instagram" target="_blank" rel="noopener">{{ CONTACTS.instagramLabel }}</a></div>
          </li>
          <li>
            <span class="contact__icon"><Icon name="send" :size="16" /></span>
            <div><small>Telegram</small><a :href="CONTACTS.telegramGroup" target="_blank" rel="noopener">Halila Telegram</a></div>
          </li>
        </ul>
      </div>
      <div class="contact__card">
        <div class="contact__card-icon"><Icon name="file" :size="22" /></div>
        <h2 class="contact__card-title">{{ t('contactPage.cardTitle') }}</h2>
        <p class="contact__card-text">{{ t('contactPage.cardText') }}</p>
        <RouterLink :to="arizaLink" class="btn btn--green btn--block">{{ t('contactPage.cardBtn') }}</RouterLink>
      </div>
    </div>
  </section>
</template>
