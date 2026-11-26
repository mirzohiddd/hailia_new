<script setup>
import { ref } from 'vue';
import { t } from '../i18n.js';
const props = defineProps({ id: { type: String, required: true } });
const playing = ref(false);
const thumb = `https://i.ytimg.com/vi/${props.id}/hqdefault.jpg`;
</script>

<template>
  <div class="video-card">
    <iframe
      v-if="playing"
      :src="`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`"
      :title="t('review')"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    />
    <button v-else type="button" class="video-card__btn" :aria-label="t('review')" @click="playing = true">
      <img :src="thumb" :alt="t('review')" loading="lazy" />
      <span class="video-card__shade" />
      <span class="video-card__play">
        <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor" /></svg>
      </span>
      <span class="video-card__label">{{ t('review') }}</span>
    </button>
  </div>
</template>
