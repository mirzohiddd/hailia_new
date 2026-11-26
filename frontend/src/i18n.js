import { ref } from 'vue';

const STORAGE_KEY = 'halila-lang';

function initialLang() {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === 'uz' || v === 'ru') return v;
  } catch (e) {}
  return 'uz';
}

export const lang = ref(initialLang());

export function setLang(v) {
  lang.value = v;
  document.documentElement.lang = v;
  try {
    localStorage.setItem(STORAGE_KEY, v);
  } catch (e) {}
}

const messages = {
  uz: {
    nav: {
      home: 'Bosh sahifa',
      products: 'Mahsulotlar',
      sales: 'Tariflar',
      reviews: 'Sharhlar',
      contact: 'Aloqa',
      apply: 'Ariza qoldirish',
      menu: 'Menyu',
      theme: "Tungi rejim"
    },
    hero: {
      badge: 'HALILA',
      title1: 'Sifatli mahsulotlar —',
      title2: 'ishonchli natija.',
      text: "Halila mahsulotlari bilan tanishing, mijozlarimiz sharhlarini ko'ring va bir necha soniyada ariza qoldiring.",
      cta: 'Mahsulotlar',
      f1: 'Sifat kafolati',
      f2: 'Tezkor yetkazib berish',
      f3: 'Mijozlarning ijobiy sharhlari'
    },
    why: {
      title: 'Nega Halila?',
      sub: 'Bizning asosiy afzalliklarimiz.',
      t1: '100% tabiiy',
      d1: 'Faqat sifatli va tabiiy tarkib.',
      t2: 'Sertifikatlangan',
      d2: 'Mahsulotlarimiz rasmiy sertifikatlarga ega.',
      t3: 'Ilmiy yondashuv',
      d3: 'Zamonaviy va ishonchli texnologiyalar.'
    },
    homeProducts: { title: 'Bizning mahsulotlar', sub: "Eng ko'p tanlanadigan mahsulotlar." },
    homeReviews: {
      title: 'Mijozlar sharhlari',
      sub: 'Mijozlarimiz mahsulotimiz haqida.',
      all: 'Barcha sharhlar'
    },
    order: 'Buyurtma berish',
    review: 'Mijoz sharhi',
    cta: {
      title: 'Hoziroq boshlaymizmi?',
      text: "Ariza qoldiring va biz siz bilan tez orada bog'lanamiz.",
      btn: 'Ariza qoldirish'
    },
    productsPage: {
      badge: 'MAHSULOTLAR',
      title: 'Mahsulotlar',
      sub: 'Tabiat kuchidagi Halila mahsulotlari bilan batafsil tanishing.'
    },
    salesPage: {
      badge: 'TARIFLAR',
      title: "Tariflar va to'plamlar",
      sub: 'Har bir tarifda bir nechta Halila mahsuloti birga keladi — eng mosini tanlang.',
      count: '{n} ta mahsulot',
      inside: 'Tarkibida:'
    },
    reviewsPage: {
      badge: 'SHARHLAR',
      title: 'Mijozlar sharhlari',
      sub: 'Mahsulotimizdan foydalangan mijozlarimizning video sharhlari.'
    },
    contactPage: {
      badge: 'ALOQA',
      title: 'Aloqa',
      sub: "Biz bilan bog'laning yoki ariza qoldiring — tez orada javob beramiz.",
      info: "Aloqa ma'lumotlari",
      phone: 'Telefon',
      cardTitle: 'Ariza qoldiring',
      cardText: "Ism va telefon raqamingizni yozing — tez orada qo'ng'iroq qilamiz.",
      cardBtn: 'Ariza qoldirish'
    },
    footer: { rights: 'Halila. Barcha huquqlar himoyalangan.' },
    ariza: {
      q: '{n}-savol',
      q1: 'Halila mahsulotini sotib olmoqchimisiz?',
      a1now: '✓ Ha, sotib olmoqchiman',
      a1later: '🕒 Ha, lekin hozir emas',
      a1unsure: "🤔 Ha, lekin hali ishonchim komil emas",
      a1no: "✕ Yo'q, sotib olmoqchi emasman",
      noTitle: 'Tushunarli, majburlamaymiz 🙂',
      noText:
        "Agar hozircha sotib olishni istamasangiz — bizning Telegram guruhimizga qo'shiling yoki savollaringiz bo'lsa admin bilan bevosita bog'laning.",
      joinGroup: "Telegram guruhimizga qo'shilish",
      contactAdmin: "Admin bilan bog'lanish — {admin}",
      q2: 'Mahsulotni kim uchun olmoqchisiz?',
      a2self: "🙋 O'zim uchun",
      a2rel: '👪 Yaqinim uchun',
      a2relSub: 'Ota-ona, aka-uka/opa-singil, farzand yoki qarindosh',
      last: 'Oxirgi qadam',
      q3: "Ma'lumotlaringizni qoldiring",
      q3text: "Ism va telefon raqamingizni yozing — tez orada qo'ng'iroq qilamiz.",
      name: 'Ism',
      phone: 'Telefon',
      namePh: 'Ismingiz',
      consent: "Ma'lumotlarim men bilan bog'lanish uchun ishlatilishiga roziman",
      submit: 'Yuborish',
      sending: 'Yuborilmoqda...',
      back: 'Orqaga',
      product: 'Mahsulot',
      okTitle: 'Rahmat! Arizangiz qabul qilindi',
      okText: "Tez orada siz bilan bog'lanamiz.",
      home: 'Bosh sahifaga qaytish',
      err: {
        invalid_name: 'Ismingizni to\'g\'ri kiriting (kamida 2 ta harf).',
        invalid_phone: "Telefon raqamini to'g'ri kiriting: +998 XX XXX XX XX",
        consent_required: 'Davom etish uchun roziligingizni belgilang.',
        duplicate: "Siz yaqinda ariza qoldirgansiz. Tez orada siz bilan bog'lanamiz.",
        too_many_requests: "Juda ko'p urinish. Birozdan so'ng qayta urinib ko'ring.",
        network: "Internet bilan bog'liq xatolik. Qayta urinib ko'ring.",
        server_error: "Xatolik yuz berdi. Qayta urinib ko'ring yoki bizga qo'ng'iroq qiling."
      }
    },
    notFound: { title: 'Sahifa topilmadi', btn: 'Bosh sahifa' }
  },

  ru: {
    nav: {
      home: 'Главная',
      products: 'Продукты',
      sales: 'Тарифы',
      reviews: 'Отзывы',
      contact: 'Контакты',
      apply: 'Оставить заявку',
      menu: 'Меню',
      theme: 'Тёмная тема'
    },
    hero: {
      badge: 'HALILA',
      title1: 'Качественные продукты —',
      title2: 'надёжный результат.',
      text: 'Познакомьтесь с продуктами Halila, посмотрите отзывы наших клиентов и оставьте заявку за несколько секунд.',
      cta: 'Продукты',
      f1: 'Гарантия качества',
      f2: 'Быстрая доставка',
      f3: 'Положительные отзывы клиентов'
    },
    why: {
      title: 'Почему Halila?',
      sub: 'Наши основные преимущества.',
      t1: '100% натурально',
      d1: 'Только качественный и натуральный состав.',
      t2: 'Сертифицировано',
      d2: 'Наша продукция имеет официальные сертификаты.',
      t3: 'Научный подход',
      d3: 'Современные и надёжные технологии.'
    },
    homeProducts: { title: 'Наши продукты', sub: 'Самые популярные продукты.' },
    homeReviews: { title: 'Отзывы клиентов', sub: 'Наши клиенты о нашей продукции.', all: 'Все отзывы' },
    order: 'Заказать',
    review: 'Отзыв клиента',
    cta: {
      title: 'Начнём прямо сейчас?',
      text: 'Оставьте заявку, и мы скоро свяжемся с вами.',
      btn: 'Оставить заявку'
    },
    productsPage: {
      badge: 'ПРОДУКТЫ',
      title: 'Продукты',
      sub: 'Подробно познакомьтесь с продуктами Halila, созданными силой природы.'
    },
    salesPage: {
      badge: 'ТАРИФЫ',
      title: 'Тарифы и наборы',
      sub: 'В каждый тариф входит несколько продуктов Halila — выберите подходящий.',
      count: '{n} продукта',
      inside: 'В составе:'
    },
    reviewsPage: {
      badge: 'ОТЗЫВЫ',
      title: 'Отзывы клиентов',
      sub: 'Видеоотзывы клиентов, которые пользовались нашей продукцией.'
    },
    contactPage: {
      badge: 'КОНТАКТЫ',
      title: 'Контакты',
      sub: 'Свяжитесь с нами или оставьте заявку — мы скоро ответим.',
      info: 'Контактная информация',
      phone: 'Телефон',
      cardTitle: 'Оставьте заявку',
      cardText: 'Напишите имя и номер телефона — мы скоро позвоним.',
      cardBtn: 'Оставить заявку'
    },
    footer: { rights: 'Halila. Все права защищены.' },
    ariza: {
      q: 'Вопрос {n}',
      q1: 'Хотите купить продукцию Halila?',
      a1now: '✓ Да, хочу купить',
      a1later: '🕒 Да, но не сейчас',
      a1unsure: '🤔 Да, но пока не уверен(а)',
      a1no: '✕ Нет, не хочу покупать',
      noTitle: 'Понятно, мы не настаиваем 🙂',
      noText:
        'Если пока не хотите покупать — присоединяйтесь к нашей Telegram-группе или напишите администратору, если есть вопросы.',
      joinGroup: 'Присоединиться к Telegram-группе',
      contactAdmin: 'Связаться с администратором — {admin}',
      q2: 'Для кого вы хотите приобрести продукт?',
      a2self: '🙋 Для себя',
      a2rel: '👪 Для близкого',
      a2relSub: 'Родители, брат/сестра, ребёнок или родственник',
      last: 'Последний шаг',
      q3: 'Оставьте свои данные',
      q3text: 'Напишите имя и номер телефона — мы скоро позвоним.',
      name: 'Имя',
      phone: 'Телефон',
      namePh: 'Ваше имя',
      consent: 'Я согласен(на), чтобы мои данные использовались для связи со мной',
      submit: 'Отправить',
      sending: 'Отправка...',
      back: 'Назад',
      product: 'Продукт',
      okTitle: 'Спасибо! Ваша заявка принята',
      okText: 'Мы скоро свяжемся с вами.',
      home: 'Вернуться на главную',
      err: {
        invalid_name: 'Введите имя правильно (минимум 2 буквы).',
        invalid_phone: 'Введите номер правильно: +998 XX XXX XX XX',
        consent_required: 'Чтобы продолжить, отметьте согласие.',
        duplicate: 'Вы недавно уже оставляли заявку. Мы скоро свяжемся с вами.',
        too_many_requests: 'Слишком много попыток. Повторите чуть позже.',
        network: 'Ошибка сети. Попробуйте ещё раз.',
        server_error: 'Произошла ошибка. Попробуйте ещё раз или позвоните нам.'
      }
    },
    notFound: { title: 'Страница не найдена', btn: 'Главная' }
  }
};

export function t(key, params) {
  let v = key.split('.').reduce((o, k) => (o == null ? o : o[k]), messages[lang.value]);
  if (v == null) v = key.split('.').reduce((o, k) => (o == null ? o : o[k]), messages.uz);
  if (typeof v !== 'string') return key;
  if (params) v = v.replace(/\{(\w+)\}/g, (_, k) => params[k] ?? '');
  return v;
}

/** {uz, ru} obyekti yoki oddiy satrdan joriy tildagi qiymat */
export function tr(value) {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  return value[lang.value] ?? value.uz;
}
