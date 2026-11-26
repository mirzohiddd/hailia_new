<script setup>
defineProps({ badge: String, title: String, sub: String });
</script>

<template>
  <section class="page-head">
    <div class="container">
      <span class="pill">{{ badge }}</span>
      <h1 class="page-head__title">{{ title }}</h1>
      <p class="page-head__sub">{{ sub }}</p>
    </div>
  </section>
</template>
