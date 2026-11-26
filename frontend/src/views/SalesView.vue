<script setup>
import PageHead from '../components/PageHead.vue';
import CtaBlock from '../components/CtaBlock.vue';
import Icon from '../components/Icon.vue';
import { t, tr, lang } from '../i18n.js';
import { PACKAGES, productById } from '../data/products.js';

function countLabel(n) {
  if (lang.value === 'ru') return `${n} ${n >= 5 ? 'продуктов' : 'продукта'}`;
  return t('salesPage.count', { n });
}
</script>

<template>
  <PageHead :badge="t('salesPage.badge')" :title="t('salesPage.title')" :sub="t('salesPage.sub')" />
  <section class="section section--page">
    <div class="container">
      <div class="grid-3 grid-3--stretch">
        <article v-for="pk in PACKAGES" :key="pk.id" class="package" :class="{ 'package--featured': pk.featured }">
          <div class="package__img">
            <img :src="pk.img" :alt="pk.name" loading="lazy" />
            <span v-if="pk.badge" class="package__badge">{{ tr(pk.badge) }}</span>
          </div>
          <div class="package__body">
            <div class="package__head">
              <h3 class="package__name">{{ pk.name }}</h3>
              <span class="package__count">{{ countLabel(pk.count) }}</span>
            </div>
            <p class="package__desc">{{ tr(pk.desc) }}</p>
            <p class="package__inside">{{ t('salesPage.inside') }}</p>
            <ul class="package__list">
              <li v-for="id in pk.items" :key="id">
                <span class="check check--sm"><Icon name="check" :size="11" :stroke="3.4" /></span>
                {{ tr(productById(id).name) }}
              </li>
            </ul>
            <RouterLink
              :to="{ path: '/contact', query: { mahsulot: pk.id } }"
              class="btn btn--block"
              :class="pk.featured ? 'btn--green' : 'btn--outline'"
            >
              {{ t('order') }}
            </RouterLink>
          </div>
        </article>
      </div>
    </div>
  </section>
  <CtaBlock />
</template>
