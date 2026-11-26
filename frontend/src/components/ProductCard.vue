<script setup>
import { t, tr } from '../i18n.js';
defineProps({ product: { type: Object, required: true } });
</script>

<template>
  <article class="product-card">
    <div class="product-card__img">
      <img :src="product.img" :alt="tr(product.name)" loading="lazy" />
    </div>
    <div class="product-card__body">
      <h3 class="product-card__name">{{ tr(product.name) }}</h3>
      <p class="product-card__desc">{{ tr(product.desc) }}</p>
      <div class="stars" aria-label="5/5">★★★★★</div>
      <RouterLink :to="{ path: '/contact', query: { mahsulot: product.id } }" class="btn btn--green btn--block">
        {{ t('order') }}
      </RouterLink>
    </div>
  </article>
</template>
