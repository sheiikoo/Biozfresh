// ============================================
// BIOZFRESH — Mock Data
// ============================================

const APP_DATA = {
  user: {
    name: 'Gerald Bryant Setiawan',
    nickname: 'Erling',
    phone: '+62 812-3456-7890',
    email: 'geraldbs@biofresh.com',
    username: 'superbiozz',
    address: 'Jl. Mawar No. 5, Situbondo',
    officeAddress: 'Jl. Raya Situbondo No. 12, Pamekasan',
    avatar: null,
    totalOrders: 5,
    bonusGallon: 1,
    bonusGallonMax: 10
  },

  products: [
    { id: 1, name: 'CLUB', price: 25000, priceLabel: 'Rp 25.000', image: null, color: '#0066CC' },
    { id: 2, name: 'CLEO', price: 10000, priceLabel: 'Rp 10.000', image: null, color: '#00AACC' },
    { id: 3, name: 'CLEO', price: 25000, priceLabel: 'Rp 25.000', image: null, color: '#00AACC' },
    { id: 4, name: 'CLEO', price: 10000, priceLabel: 'Rp 10.000', image: null, color: '#00AACC' },
    { id: 5, name: 'CLUB', price: 10000, priceLabel: 'Rp 10.000', image: null, color: '#0066CC' },
    { id: 6, name: 'LE MINERALE', price: 21000, priceLabel: 'Rp 21.000', image: null, color: '#00AA44' },
    { id: 7, name: 'CLUB', price: 10000, priceLabel: 'Rp 10.000', image: null, color: '#0066CC' },
    { id: 8, name: 'CLUB', price: 10000, priceLabel: 'Rp 10.000', image: null, color: '#0066CC' },
    { id: 9, name: 'CLUB', price: 10000, priceLabel: 'Rp 10.000', image: null, color: '#0066CC' },
    { id: 10, name: 'CLUB', price: 10000, priceLabel: 'Rp 10.000', image: null, color: '#0066CC' },
  ],

  currentOrder: {
    id: 'BF-30231',
    status: 'In Progress',
    deliveryProgressText: 'Driver is arriving in 10 mins',
    courier: {
      name: 'Kevin de Bruyne',
      phone: '+6281 2345 6789',
      avatar: null,
    },
    address: 'Jl. Mawar No. 5, Malang',
    items: [
      { name: 'Club Refill (5 Gallons)', price: 'Rp 10.000' },
    ],
    distance: '3 km',
    distancePrice: 'Rp 3.000',
    total: 'Rp 50.000',
    date: 'March 23, 2024',
    paymentMethod: 'QRIS',
    paymentStatus: 'PAID',
    estimatedDelivery: '30-45 minutes',
  },

  orderHistory: [
    {
      id: 'BF-30230',
      courier: { name: 'Kevin de Bruyne', phone: '+6281 2345 6789', avatar: null },
      address: 'Jl. Arjuno No. 5, Malang',
      date: 'March 22, 2024, 14:00',
      items: [{ name: 'Club Refill', qty: 3, price: 'Rp 10.000' }],
      total: 'Rp 50.000',
      paymentMethod: 'Coin',
      status: 'Completed',
    },
  ],

  savedAddresses: [
    { label: 'Rumah', address: 'Jl. Mawar No. 50, Malang', phone: '0812 3456 6789' },
    { label: 'Kantor', address: 'Jl. Arjuno No. 5, Malang', phone: '' },
  ],

  chatContacts: [
    { id: 1, name: 'Gerald Bryant Setiawan', initials: 'GBS', lastMessage: 'Sudah tiba belum?...', time: '09.31', unread: 0, color: '#4CAF50' },
    { id: 2, name: 'Rizky Abdul', initials: 'RA', lastMessage: 'Siap motor diangkut...', time: '09.31', unread: 1, color: '#FF5722' },
    { id: 3, name: 'Kevin De Bruyne', initials: 'KB', lastMessage: 'Ok...', time: '08.31', unread: 1, color: '#2196F3' },
    { id: 4, name: 'Max Budi', initials: 'MB', lastMessage: 'Udah bayar belum...', time: '08.01', unread: 0, color: '#9C27B0' },
  ],

  chatMessages: {
    1: {
      name: 'Gerald Bryant Setiawan',
      messages: [
        { id: 1, text: 'Halo, pesanan saya sudah sampai belum?', sent: false, time: '09.00', date: '11 April 2026' },
        { id: 2, text: 'Sudah dalam perjalanan pak', sent: true, time: '09.10', date: '11 April 2026' },
        { id: 3, text: 'Sudah tiba belum?', sent: false, time: '09.31', date: '11 April 2026' },
      ]
    },
    2: {
      name: 'Rizky Abdul',
      messages: [
        { id: 1, text: 'Pesan air 2 galon...', sent: false, time: '09.00', date: '11 April 2026' },
        { id: 2, text: 'Sudah dipesan belum aplikasi saya gak?...', sent: false, time: '09.05', date: '11 April 2026' },
        { id: 3, text: 'Sudah mas', sent: true, time: '09.10', date: '11 April 2026' },
        { id: 4, text: 'Siap motor diangkut yah', sent: true, time: '09.12', date: '11 April 2026' },
      ]
    },
    3: {
      name: 'Kevin De Bruyne',
      messages: [
        { id: 1, text: 'Sudah dipesan belum aplikasi saya gak?...', sent: false, time: '09.00', date: '11 April 2026' },
        { id: 2, text: 'Sudah mas', sent: true, time: '09.05', date: '11 April 2026' },
        { id: 3, text: 'Siap motor diangkut yah', sent: true, time: '09.10', date: '11 April 2026' },
        { id: 4, text: 'Pesan air 3 galon...', sent: false, time: '10.00', date: '12 April 2026', unread: true },
        { id: 5, text: 'Mangga', sent: true, time: '10.05', date: '12 April 2026' },
        { id: 6, text: 'Oia tadi, alatain diangkut', sent: true, time: '10.08', date: '12 April 2026' },
        { id: 7, text: 'Habis kamu beli', sent: false, time: '10.10', date: '12 April 2026' },
      ]
    },
    4: {
      name: 'Max Budi',
      messages: [
        { id: 1, text: 'Udah bayar belum pesanannya?', sent: false, time: '07.50', date: '11 April 2026' },
        { id: 2, text: 'Sudah pak, via transfer', sent: true, time: '08.01', date: '11 April 2026' },
      ]
    },
  },

  feedbackTags: ['Fast Delivery', 'Friendly Courier', 'Pristine Quality', 'Easy Ordering'],
};

// SVG Icons
const ICONS = {
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  orders: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="18" rx="2"/><path d="M8 7h8M8 11h8M8 15h4"/></svg>',
  profile: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  location: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22,7 12,13 2,7"/></svg>',
  edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>',
  chevronRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>',
  star: '★',
  starEmpty: '☆',
  lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>',
  bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>',
  help: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  file: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
  logout: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
  upload: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></svg>',
  camera: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>',
  emoji: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>',
  attach: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>',
  send: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>',
  map: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>',
  cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>',
  package: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
  droplet: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/></svg>',
  google: '<svg viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>',
  facebook: '<svg viewBox="0 0 24 24" fill="white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
};

// Helper to create product SVG placeholder
function createProductSVG(name, color) {
  return `<svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
    <rect x="25" y="10" width="50" height="100" rx="5" fill="${color}" opacity="0.15"/>
    <rect x="30" y="0" width="40" height="15" rx="4" fill="${color}" opacity="0.3"/>
    <rect x="35" y="15" width="30" height="5" fill="${color}" opacity="0.2"/>
    <rect x="28" y="35" width="44" height="25" rx="3" fill="${color}" opacity="0.25"/>
    <text x="50" y="52" text-anchor="middle" font-size="8" font-weight="bold" fill="${color}">${name}</text>
    <circle cx="50" cy="80" r="12" fill="${color}" opacity="0.1"/>
    <text x="50" y="84" text-anchor="middle" font-size="8" fill="${color}">💧</text>
  </svg>`;
}

// Avatar SVG
function createAvatarSVG(initials, color) {
  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="50" fill="${color}"/>
    <text x="50" y="55" text-anchor="middle" dominant-baseline="middle" font-size="32" font-weight="600" fill="white" font-family="Poppins, sans-serif">${initials}</text>
  </svg>`;
}
