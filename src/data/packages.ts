import { FlowerPackage } from '../types';

export const FLOWER_PACKAGES: FlowerPackage[] = [
  {
    id: 'bloom',
    name: 'Bloom',
    price: 8000,
    formattedPrice: 'Rp 8.000',
    label: 'SIMPLE & SWEET',
    description: 'Paket bunga sederhana untuk memberikan perhatian kecil yang berarti.',
    items: [
      '🌼 Bunga Peacock Aster',
      '💌 Letter (Kartu Ucapan)'
    ],
    icon: '🌼',
    accentColor: 'from-amber-50 to-orange-50'
  },
  {
    id: 'sweet-bloom',
    name: 'Sweet Bloom',
    price: 15000,
    formattedPrice: 'Rp 15.000',
    label: 'FLOWER & SNACK',
    description: 'Bunga cantik dengan tambahan snack mini untuk kejutan yang lebih seru.',
    popular: true,
    tag: 'FAVORITE',
    items: [
      '🌼 Bunga Peacock Aster',
      '💌 Letter (Kartu Ucapan)',
      '🥛 Susu mini',
      '🍫 Tanggo',
      '🍪 Krisbee',
      '🐼 Hello Panda',
      '🍬 Yupi Love isi 3'
    ],
    icon: '💐',
    accentColor: 'from-rose-50 to-pink-50'
  },
  {
    id: 'lovely-bloom',
    name: 'Lovely Bloom',
    price: 18000,
    formattedPrice: 'Rp 18.000',
    label: 'EXTRA LOVELY',
    description: 'Paket lengkap dengan bunga, letter, dan berbagai snack mini.',
    items: [
      '🌼 Bunga Peacock Aster',
      '💌 Letter (Kartu Ucapan)',
      '🍪 Tini Wini Biti',
      '🐼 Hello Panda',
      '🥛 Susu mini ×2',
      '🍫 Tanggo',
      '🍪 Krisbee',
      '🍬 Yupi isi 3'
    ],
    icon: '🌸',
    accentColor: 'from-fuchsia-50 to-rose-50'
  }
];

export const WHY_POINTS = [
  {
    icon: '🌷',
    title: 'Beautiful Flowers',
    desc: 'Pilihan bunga yang cantik dan cocok untuk berbagai momen spesial.'
  },
  {
    icon: '💌',
    title: 'Personal Message',
    desc: 'Tambahkan ucapan pribadi agar hadiah terasa lebih bermakna.'
  },
  {
    icon: '🎁',
    title: 'Special Surprise',
    desc: 'Siapkan kejutan sederhana untuk orang yang kamu tuju.'
  }
];

export const SERVICES = [
  {
    icon: '🌷',
    title: 'Flower Delivery',
    desc: 'Pesan bunga dan kami akan membantu mengantarkannya kepada orang yang kamu tuju.',
    featured: false
  },
  {
    icon: '💐',
    title: 'Flower + Message',
    desc: 'Lengkapi bunga dengan ucapan pribadi untuk membuat hadiah menjadi lebih spesial.',
    featured: true,
    badge: 'MOST POPULAR'
  },
  {
    icon: '🎁',
    title: 'Surprise Delivery',
    desc: 'Berikan kejutan kepada penerima dengan pengiriman bunga.',
    featured: false
  },
  {
    icon: '🌹',
    title: 'Custom Bouquet',
    desc: 'Ingin bunga dengan konsep tertentu? Kamu bisa melakukan pemesanan secara custom.',
    featured: false
  }
];

export const HOW_IT_WORKS_STEPS = [
  {
    step: '01',
    title: 'Pilih Bunga',
    desc: 'Pilih paket bunga yang sesuai dengan keinginanmu.'
  },
  {
    step: '02',
    title: 'Tulis Ucapan',
    desc: 'Tulis pesan yang ingin disampaikan kepada penerima.'
  },
  {
    step: '03',
    title: 'Isi Detail',
    desc: 'Masukkan nama penerima dan catatan pesanan.'
  },
  {
    step: '04',
    title: 'Bayar & Kirim Bukti',
    desc: 'Lakukan pembayaran melalui QRIS lalu upload bukti pembayaran.'
  }
];

export const MESSAGE_TEMPLATES = [
  'Semangat terus yaa! Kamu pasti bisa ngelewatin ini semua. I am always proud of you! 🌷',
  'Happy Birthday! Semoga tahun ini penuh kebahagiaan, kesehatan, dan senyuman manis. 💐',
  'Terima kasih sudah selalu ada dan jadi orang yang luar biasa. A little flower for you! 🌸',
  'Jangan lupa istirahat dan makan yang cukup yaa. You deserve all the good things today! 🌼'
];

export const CONTACT_WHATSAPP = '6282227989167';
export const CONTACT_WHATSAPP_URL = 'https://wa.me/6282227989167';
