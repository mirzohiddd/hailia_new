<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import Icon from '../components/Icon.vue';
import { t } from '../i18n.js';
import { CONTACTS, API_URL } from '../data/site.js';

const route = useRoute();
const product = typeof route.query.mahsulot === 'string' ? route.query.mahsulot : '';

// 1 → 2 → 3 → done;  1 → 'no'
const step = ref(1);
const form = reactive({ intent: '', forWhom: '', name: '', phone: '+998 ', consent: false, company: '' });
const sending = ref(false);
const error = ref('');
const fieldErr = reactive({ name: false, phone: false, consent: false });
let startedAt = Date.now();
const nameInput = ref(null);

onMounted(() => (startedAt = Date.now()));

const stepLabel = computed(() => (step.value === 3 ? t('ariza.last') : t('ariza.q', { n: step.value })));

function chooseIntent(v) {
  if (v === 'no') {
    step.value = 'no';
    return;
  }
  form.intent = v;
  step.value = 2;
}
async function chooseForWhom(v) {
  form.forWhom = v;
  step.value = 3;
  await nextTick();
  nameInput.value?.focus();
}
function back() {
  error.value = '';
  if (step.value === 'no' || step.value === 2) step.value = 1;
  else if (step.value === 3) step.value = 2;
}

// +998 XX XXX XX XX formatlash
function formatPhone(raw) {
  // "+998" prefiksini qayerda bo'lmasin olib tashlaymiz (kursor boshida bo'lsa ham)
  let d = raw.replace('+998', '').replace(/\D/g, '');
  if (d.length > 9 && d.startsWith('998')) d = d.slice(3);
  d = d.slice(0, 9);
  const parts = [d.slice(0, 2), d.slice(2, 5), d.slice(5, 7), d.slice(7, 9)].filter(Boolean);
  return '+998 ' + parts.join(' ');
}
function onPhoneInput(e) {
  form.phone = formatPhone(e.target.value);
  e.target.value = form.phone;
  fieldErr.phone = false;
}
function toEnd(e) {
  const el = e.target;
  requestAnimationFrame(() => el.setSelectionRange(el.value.length, el.value.length));
}
const phoneDigits = computed(() => form.phone.replace(/\D/g, ''));
const nameValid = computed(() => /^[\p{L}][\p{L}\s'ʻʼ‘’`.-]{1,59}$/u.test(form.name.trim()));

async function submit() {
  error.value = '';
  fieldErr.name = !nameValid.value;
  fieldErr.phone = !/^998[1-9]\d{8}$/.test(phoneDigits.value);
  fieldErr.consent = !form.consent;
  if (fieldErr.name) return (error.value = t('ariza.err.invalid_name'));
  if (fieldErr.phone) return (error.value = t('ariza.err.invalid_phone'));
  if (fieldErr.consent) return (error.value = t('ariza.err.consent_required'));

  sending.value = true;
  try {
    const res = await fetch(`${API_URL}/api/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name.trim(),
        phone: '+' + phoneDigits.value,
        product,
        intent: form.intent,
        forWhom: form.forWhom,
        consent: form.consent,
        company: form.company,
        startedAt
      })
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.ok) {
      step.value = 'done';
    } else {
      const code = data.error || 'server_error';
      const msg = t('ariza.err.' + code);
      error.value = msg.startsWith('ariza.') ? t('ariza.err.server_error') : msg;
    }
  } catch (e) {
    error.value = t('ariza.err.network');
  } finally {
    sending.value = false;
  }
}
</script>

<template>
  <section class="ariza">
    <div class="container">
      <div class="ariza__card">
        <!-- 1-savol -->
        <template v-if="step === 1">
          <span class="pill">{{ stepLabel }}</span>
          <h1 class="ariza__title">{{ t('ariza.q1') }}</h1>
          <div class="options">
            <button type="button" class="option" @click="chooseIntent('now')">{{ t('ariza.a1now') }}</button>
            <button type="button" class="option" @click="chooseIntent('later')">{{ t('ariza.a1later') }}</button>
            <button type="button" class="option" @click="chooseIntent('unsure')">{{ t('ariza.a1unsure') }}</button>
            <button type="button" class="option" @click="chooseIntent('no')">{{ t('ariza.a1no') }}</button>
          </div>
        </template>

        <!-- "Yo'q" javobi -->
        <template v-else-if="step === 'no'">
          <h1 class="ariza__title">{{ t('ariza.noTitle') }}</h1>
          <p class="ariza__text">{{ t('ariza.noText') }}</p>
          <div class="options">
            <a class="btn btn--green btn--block" :href="CONTACTS.telegramGroup" target="_blank" rel="noopener">
              <Icon name="send" :size="18" /> {{ t('ariza.joinGroup') }}
            </a>
            <a class="btn btn--outline btn--block" :href="CONTACTS.telegramAdmin" target="_blank" rel="noopener">
              {{ t('ariza.contactAdmin', { admin: CONTACTS.telegramAdminLabel }) }}
            </a>
          </div>
          <button type="button" class="back" @click="back"><Icon name="arrowLeft" :size="16" /> {{ t('ariza.back') }}</button>
        </template>

        <!-- 2-savol -->
        <template v-else-if="step === 2">
          <span class="pill">{{ stepLabel }}</span>
          <h1 class="ariza__title">{{ t('ariza.q2') }}</h1>
          <div class="options">
            <button type="button" class="option" @click="chooseForWhom('self')">{{ t('ariza.a2self') }}</button>
            <button type="button" class="option" @click="chooseForWhom('relative')">
              <strong>{{ t('ariza.a2rel') }}</strong>
              <small>{{ t('ariza.a2relSub') }}</small>
            </button>
          </div>
          <button type="button" class="back" @click="back"><Icon name="arrowLeft" :size="16" /> {{ t('ariza.back') }}</button>
        </template>

        <!-- Oxirgi qadam -->
        <template v-else-if="step === 3">
          <span class="pill">{{ stepLabel }}</span>
          <h1 class="ariza__title">{{ t('ariza.q3') }}</h1>
          <p class="ariza__text">{{ t('ariza.q3text') }}</p>
          <form class="form" novalidate @submit.prevent="submit">
            <label class="field" :class="{ 'field--err': fieldErr.name }">
              <span>{{ t('ariza.name') }} *</span>
              <input
                ref="nameInput"
                v-model="form.name"
                type="text"
                name="name"
                autocomplete="name"
                maxlength="60"
                :placeholder="t('ariza.namePh')"
                @input="fieldErr.name = false"
              />
            </label>
            <label class="field" :class="{ 'field--err': fieldErr.phone }">
              <span>{{ t('ariza.phone') }} *</span>
              <input
                :value="form.phone"
                type="tel"
                name="phone"
                autocomplete="tel"
                inputmode="tel"
                placeholder="+998 90 123 45 67"
                @input="onPhoneInput"
                @focus="toEnd"
              />
            </label>
            <!-- Honeypot: odamlarga ko'rinmaydi, botlar to'ldiradi -->
            <label class="hp" aria-hidden="true">
              Company
              <input v-model="form.company" type="text" name="company" tabindex="-1" autocomplete="off" />
            </label>
            <label class="consent" :class="{ 'consent--err': fieldErr.consent }">
              <input v-model="form.consent" type="checkbox" @change="fieldErr.consent = false" />
              <span>{{ t('ariza.consent') }}</span>
            </label>
            <p v-if="error" class="form__error" role="alert">{{ error }}</p>
            <button type="submit" class="btn btn--green btn--block btn--lg" :disabled="sending">
              {{ sending ? t('ariza.sending') : t('ariza.submit') }}
            </button>
          </form>
          <button type="button" class="back" @click="back"><Icon name="arrowLeft" :size="16" /> {{ t('ariza.back') }}</button>
        </template>

        <!-- Muvaffaqiyat -->
        <template v-else-if="step === 'done'">
          <div class="ariza__done-icon"><Icon name="check" :size="28" :stroke="3" /></div>
          <h1 class="ariza__title">{{ t('ariza.okTitle') }}</h1>
          <p class="ariza__text">{{ t('ariza.okText') }}</p>
          <RouterLink to="/" class="btn btn--outline btn--block">{{ t('ariza.home') }}</RouterLink>
        </template>
      </div>
    </div>
  </section>
</template>
