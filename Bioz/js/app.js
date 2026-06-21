// ============================================
// BIOZFRESH — App Router & State (Enhanced)
// ============================================

let appState = {
  cart: { 1: 2 },
  rating: 0,
  selectedTags: [],
  currentChat: 2,
  paymentMethod: 'cash',
  rememberMe: false,
  orderTab: 'active',
  favorites: [],
  isLoading: false,
};

function navigate(hash) {
  window.location.hash = hash;
}

function goBack() {
  window.history.back();
}

function updateQty(productId, delta) {
  const current = appState.cart[productId] || 0;
  const newQty = Math.max(0, current + delta);
  if (newQty === 0) delete appState.cart[productId];
  else appState.cart[productId] = newQty;
  renderCurrentScreen();
}

function setRating(r) {
  appState.rating = r;
  // Animate stars
  document.querySelectorAll('.star-rating .star').forEach((s, i) => {
    s.style.transition = `transform ${100 + i * 50}ms ease, color ${100 + i * 50}ms ease`;
    if (i < r) {
      s.classList.add('active');
      s.style.transform = 'scale(1.2)';
      setTimeout(() => { s.style.transform = 'scale(1)'; }, 200);
    } else {
      s.classList.remove('active');
    }
  });
  // Update response text
  const ratingTexts = ['', 'Terrible experience', 'Bad experience', 'Okay experience', 'Fantastic service, highly recommend!', 'Outstanding service!'];
  const responseEl = document.querySelector('.feedback-response');
  if (responseEl) { responseEl.textContent = ratingTexts[r] || ''; responseEl.style.animation = 'none'; responseEl.offsetHeight; responseEl.style.animation = 'screenFadeIn 300ms ease'; }
}

function getCartTotal() {
  let count = 0, total = 0;
  if (!appState.cartTypes) appState.cartTypes = {};
  for (const [id, qty] of Object.entries(appState.cart)) {
    const p = APP_DATA.products.find(pr => pr.id == id);
    if (p) {
      count += qty;
      const type = appState.cartTypes[id] || 'refill';
      const itemPrice = type === 'new' ? p.price + 15000 : p.price;
      total += itemPrice * qty;
    }
  }
  return { count, total };
}

const routes = {
  '': 'renderWelcome',
  '#welcome': 'renderWelcome',
  '#register': 'renderRegister',
  '#login': 'renderLogin',
  '#home': 'renderHome',
  '#orders': 'renderOrders',
  '#checkout': 'renderCheckout',
  '#location': 'renderLocation',
  '#payment-method': 'renderPaymentMethod',
  '#order-success': 'renderOrderSuccess',
  '#my-orders': 'renderMyOrders',
  '#my-orders-empty': 'renderMyOrdersEmpty',
  '#order-detail': 'renderOrderDetail',
  '#feedback': 'renderFeedback',
  '#feedback-sent': 'renderFeedbackSent',
  '#messages': 'renderMessages',
  '#chat': 'renderChat',
  '#profile': 'renderProfile',
  '#edit-profile': 'renderEditProfile',
  '#edit-profile-success': 'renderEditProfileSuccess',
  '#payment-success': 'renderPaymentSuccess',
  '#payment-failed': 'renderPaymentFailed',
};

function renderCurrentScreen() {
  const hash = window.location.hash || '';
  const fn = routes[hash] || 'renderWelcome';
  const app = document.getElementById('app');
  
  if (window[fn]) {
    app.innerHTML = window[fn]();
    afterRender(hash);
  }
  window.scrollTo(0, 0);
}

// Post-render hooks for specific screens
function afterRender(hash) {
  // Auto-scroll chat to bottom
  if (hash === '#chat') {
    const msgs = document.querySelector('.conversation-messages');
    if (msgs) setTimeout(() => msgs.scrollTo({ top: msgs.scrollHeight, behavior: 'auto' }), 50);
  }
  // Focus chat input
  if (hash === '#chat') {
    const input = document.getElementById('chat-input');
    if (input) setTimeout(() => input.focus(), 300);
  }
}

window.addEventListener('hashchange', renderCurrentScreen);
window.addEventListener('DOMContentLoaded', renderCurrentScreen);
