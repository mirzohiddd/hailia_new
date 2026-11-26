<script setup>
import PageHead from '../components/PageHead.vue';
import VideoCard from '../components/VideoCard.vue';
import CtaBlock from '../components/CtaBlock.vue';
import { t } from '../i18n.js';
import { REVIEW_VIDEOS } from '../data/site.js';
</script>

<template>
  <PageHead :badge="t('reviewsPage.badge')" :title="t('reviewsPage.title')" :sub="t('reviewsPage.sub')" />
  <section class="section section--page">
    <div class="container">
      <div class="grid-3 grid-3--tight">
        <VideoCard v-for="id in REVIEW_VIDEOS" :key="id" :id="id" />
      </div>
    </div>
  </section>
  <CtaBlock />
</template>
