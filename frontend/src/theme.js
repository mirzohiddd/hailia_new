import { ref } from 'vue';

export const isDark = ref(document.documentElement.classList.contains('dark'));

export function toggleTheme() {
  isDark.value = !isDark.value;
  document.documentElement.classList.toggle('dark', isDark.value);
  try {
    localStorage.setItem('halila-theme', isDark.value ? 'dark' : 'light');
  } catch (e) {}
}
