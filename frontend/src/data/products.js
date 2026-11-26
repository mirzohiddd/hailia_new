// Mahsulotlar. Tavsiflar tasdiqlanmagan tibbiy da'volarsiz yozilgan.
export const PRODUCTS = [
  {
    id: 'halila-60',
    name: 'Halila 60+',
    img: '/img/products/halila-60.png',
    desc: {
      uz: '60 dan ortiq tabiiy giyoh va minerallar asosida tayyorlangan pasta.',
      ru: 'Паста на основе более 60 натуральных трав и минералов.'
    }
  },
  {
    id: 'geniy',
    name: 'Halila Geniy',
    img: '/img/products/geniy.png',
    desc: {
      uz: 'Halila "Geniy" — tabiiy giyohlar asosida tayyorlangan mahsulot.',
      ru: 'Halila «Geniy» — продукт на основе натуральных трав.'
    }
  },
  {
    id: 'yara-majuni',
    name: { uz: "Yara ma'juni", ru: 'Яра маъжуни' },
    img: '/img/products/yara-majuni.png',
    desc: {
      uz: 'Halila "Yara ma\'juni" — tabiiy giyohlar asosida tayyorlangan ma\'jun.',
      ru: 'Halila «Яра маъжуни» — маъжун на основе натуральных трав.'
    }
  },
  {
    id: 'azorik',
    name: { uz: 'Azorik pastasi', ru: 'Паста Азорик' },
    img: '/img/products/azorik.png',
    desc: {
      uz: 'Azorik pastasi — tabiiy giyohlar asosida tayyorlangan pasta.',
      ru: 'Паста Азорик — паста на основе натуральных трав.'
    }
  },
  {
    id: 'sirop',
    name: { uz: 'Halila Sirop', ru: 'Halila Сироп' },
    img: '/img/products/sirop.png',
    desc: {
      uz: 'Halila siropi — tabiiy giyohlar asosida tayyorlangan sirop.',
      ru: 'Сироп Halila — сироп на основе натуральных трав.'
    }
  },
  {
    id: 'pasta-honey',
    name: 'Pasta Honey',
    img: '/img/products/pasta-honey.png',
    desc: {
      uz: 'Halila "Pasta Honey" — tabiiy asal va giyohlar qorishmasi.',
      ru: 'Halila «Pasta Honey» — смесь натурального мёда и трав.'
    }
  }
];

// Bosh sahifada ko'rsatiladigan mahsulotlar
export const HOME_PRODUCTS = PRODUCTS.slice(0, 3);

export const PACKAGES = [
  {
    id: 'silver',
    name: 'Silver',
    img: '/img/packages/silver.jpg',
    count: 3,
    badge: null,
    featured: false,
    desc: {
      uz: 'Boshlash uchun ideal — asosiy 3 ta mahsulot.',
      ru: 'Идеально для начала — 3 основных продукта.'
    },
    items: ['sirop', 'halila-60', 'geniy']
  },
  {
    id: 'gold',
    name: 'Gold',
    img: '/img/packages/gold.jpg',
    count: 4,
    badge: { uz: 'Ommabop', ru: 'Популярный' },
    featured: true,
    desc: {
      uz: "Kengaytirilgan, to'liqroq to'plam.",
      ru: 'Расширенный, более полный набор.'
    },
    items: ['sirop', 'halila-60', 'geniy', 'yara-majuni']
  },
  {
    id: 'gold-plus',
    name: 'Gold Plus',
    img: '/img/packages/gold-plus.jpg',
    count: 6,
    badge: { uz: "Eng to'liq", ru: 'Самый полный' },
    featured: false,
    desc: {
      uz: "Maksimal natija uchun eng to'liq to'plam.",
      ru: 'Самый полный набор для максимального результата.'
    },
    items: ['sirop', 'halila-60', 'geniy', 'yara-majuni', 'azorik', 'pasta-honey']
  }
];

export function productById(id) {
  return PRODUCTS.find((p) => p.id === id);
}
