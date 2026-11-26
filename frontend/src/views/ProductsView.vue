<script setup>
import PageHead from '../components/PageHead.vue';
import ProductCard from '../components/ProductCard.vue';
import CtaBlock from '../components/CtaBlock.vue';
import { t } from '../i18n.js';
import { PRODUCTS } from '../data/products.js';
</script>

<template>
  <PageHead :badge="t('productsPage.badge')" :title="t('productsPage.title')" :sub="t('productsPage.sub')" />
  <section class="section section--page">
    <div class="container">
      <div class="grid-3">
        <ProductCard v-for="p in PRODUCTS" :key="p.id" :product="p" />
      </div>
    </div>
  </section>
  <CtaBlock />
</template>
