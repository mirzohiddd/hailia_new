// Original saytdagi aloqa ma'lumotlari va havolalar
export const CONTACTS = {
  phone: '+998 78 113 88 11',
  phoneHref: 'tel:+998781138811',
  youtube: 'https://www.youtube.com/@halila_uz',
  youtubeLabel: '@halila_uz',
  instagram: 'https://www.instagram.com/halila.uz/',
  instagramLabel: 'halila.uz',
  telegramGroup: 'https://t.me/+ug1vmKzglNY4MmM6',
  telegramAdmin: 'https://t.me/Tabib_yusuf',
  telegramAdminLabel: '@Tabib_yusuf'
};

// Mijozlar video sharhlari (YouTube ID). Yangi video qo'shish uchun ID ni shu ro'yxatga qo'shing.
// Bosh sahifada birinchi 3 tasi ko'rsatiladi.
export const REVIEW_VIDEOS = ['V4PVRFqFRE8', 'rNOLaAZ-K1M', 'mh1w2sKX--I', 'ix0D7ke8qY0'];

export const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
