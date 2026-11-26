<script setup>
import SiteHeader from './components/SiteHeader.vue';
import SiteFooter from './components/SiteFooter.vue';
</script>

<template>
  <SiteHeader />
  <main>
    <RouterView :key="$route.path" />
  </main>
  <SiteFooter />
</template>
