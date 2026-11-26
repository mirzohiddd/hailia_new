<script setup>
import { t } from '../i18n.js';
</script>

<template>
  <section class="section section--cta">
    <div class="container">
      <div class="cta">
        <h2 class="cta__title">{{ t('cta.title') }}</h2>
        <p class="cta__text">{{ t('cta.text') }}</p>
        <RouterLink to="/contact" class="btn btn--dark">{{ t('cta.btn') }}</RouterLink>
      </div>
    </div>
  </section>
</template>
