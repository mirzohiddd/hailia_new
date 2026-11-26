<script setup>
import { t } from '../i18n.js';
</script>

<template>
  <section class="page-head page-head--404">
    <div class="container">
      <h1 class="page-head__title">404</h1>
      <p class="page-head__sub">{{ t('notFound.title') }}</p>
      <RouterLink to="/" class="btn btn--green mt-24">{{ t('notFound.btn') }}</RouterLink>
    </div>
  </section>
</template>
