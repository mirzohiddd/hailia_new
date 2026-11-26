<script setup>
import Icon from '../components/Icon.vue';
import ProductCard from '../components/ProductCard.vue';
import VideoCard from '../components/VideoCard.vue';
import CtaBlock from '../components/CtaBlock.vue';
import { t } from '../i18n.js';
import { HOME_PRODUCTS } from '../data/products.js';
import { REVIEW_VIDEOS } from '../data/site.js';

const features = [
  { icon: 'leaf', title: 'why.t1', desc: 'why.d1' },
  { icon: 'shield', title: 'why.t2', desc: 'why.d2' },
  { icon: 'flaskAlt', title: 'why.t3', desc: 'why.d3' }
];
</script>

<template>
  <section class="hero">
    <div class="container hero__inner">
      <div class="hero__text">
        <span class="pill pill--lg">{{ t('hero.badge') }}</span>
        <h1 class="hero__title">
          {{ t('hero.title1') }}<br />
          <span class="text-green">{{ t('hero.title2') }}</span>
        </h1>
        <p class="hero__lead">{{ t('hero.text') }}</p>
        <RouterLink to="/products" class="btn btn--green btn--lg">{{ t('hero.cta') }}</RouterLink>
        <ul class="checklist">
          <li><span class="check"><Icon name="check" :size="14" :stroke="3.2" /></span>{{ t('hero.f1') }}</li>
          <li><span class="check"><Icon name="check" :size="14" :stroke="3.2" /></span>{{ t('hero.f2') }}</li>
          <li><span class="check"><Icon name="check" :size="14" :stroke="3.2" /></span>{{ t('hero.f3') }}</li>
        </ul>
      </div>
      <div class="hero__media">
        <img src="/img/bosh-sahifa.jpg" alt="Halila 60+" width="969" height="1219" />
      </div>
    </div>
  </section>

  <section class="section section--alt">
    <div class="container">
      <div class="section-head">
        <h2 class="section-title">{{ t('why.title') }}</h2>
        <p class="section-sub">{{ t('why.sub') }}</p>
      </div>
      <div class="grid-3">
        <div v-for="f in features" :key="f.title" class="feature">
          <div class="feature__icon"><Icon :name="f.icon" :size="24" /></div>
          <h3 class="feature__title">{{ t(f.title) }}</h3>
          <p class="feature__desc">{{ t(f.desc) }}</p>
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="section-head">
        <h2 class="section-title">{{ t('homeProducts.title') }}</h2>
        <p class="section-sub">{{ t('homeProducts.sub') }}</p>
      </div>
      <div class="grid-3">
        <ProductCard v-for="p in HOME_PRODUCTS" :key="p.id" :product="p" />
      </div>
    </div>
  </section>

  <section class="section section--alt">
    <div class="container">
      <div class="section-head">
        <h2 class="section-title">{{ t('homeReviews.title') }}</h2>
        <p class="section-sub">{{ t('homeReviews.sub') }}</p>
      </div>
      <div class="grid-3">
        <VideoCard v-for="id in REVIEW_VIDEOS.slice(0, 3)" :key="id" :id="id" />
      </div>
      <div class="center mt-32">
        <RouterLink to="/reviews" class="btn btn--outline">{{ t('homeReviews.all') }} <Icon name="arrowRight" :size="18" :stroke="2.4" /></RouterLink>
      </div>
    </div>
  </section>

  <CtaBlock />
</template>
