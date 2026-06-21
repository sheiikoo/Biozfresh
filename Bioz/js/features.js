// ============================================
// BIOZFRESH — Additional Features & Interactions
// ============================================

// === Pull to Refresh ===
function initPullToRefresh() {
  const screen = document.querySelector('.home-screen');
  if (!screen) return;
  let startY = 0, pulling = false;
  screen.addEventListener('touchstart', e => { if (screen.scrollTop === 0) { startY = e.touches[0].pageY; pulling = true; } });
  screen.addEventListener('touchmove', e => {
    if (!pulling) return;
    const diff = e.touches[0].pageY - startY;
    if (diff > 60) {
      let ptr = screen.querySelector('.ptr-indicator');
      if (!ptr) { ptr = document.createElement('div'); ptr.className = 'ptr-indicator'; ptr.innerHTML = '<div class="spinner"></div> Refreshing...'; screen.querySelector('.home-content')?.prepend(ptr); }
      ptr.classList.add('visible');
    }
  });
  screen.addEventListener('touchend', () => {
    if (!pulling) return; pulling = false;
    const ptr = screen.querySelector('.ptr-indicator');
    if (ptr?.classList.contains('visible')) {
      setTimeout(() => { ptr.classList.remove('visible'); setTimeout(() => ptr?.remove(), 300); showToast('Content refreshed!', 'success'); }, 1200);
    }
  });
}

// === Home Loading Skeleton ===
function renderHomeWithSkeleton() {
  const app = document.getElementById('app');
  app.innerHTML = renderHomeSkeleton();
  setTimeout(() => { app.innerHTML = renderHome(); initPullToRefresh(); }, 1500);
}

function renderHomeSkeleton() {
  return `<div class="screen with-bottom-nav home-screen">
    <div class="home-header">
      <div class="home-header-top">
        <span class="logo-text" style="color:#fff;font-size:18px">bio<span class="z" style="color:#7CDA24">z</span>fresh</span>
        <div class="skeleton skeleton-circle" style="width:36px;height:36px;background:rgba(255,255,255,0.15)"></div>
      </div>
      <div style="margin-top:12px"><div class="skeleton skeleton-text" style="width:60%;height:16px;background:rgba(255,255,255,0.12)"></div>
      <div class="skeleton skeleton-text short" style="width:40%;height:10px;background:rgba(255,255,255,0.08);margin-top:6px"></div></div>
      <div class="skeleton-stats"><div class="skeleton skeleton-stat"></div><div class="skeleton skeleton-stat"></div></div>
    </div>
    <div class="home-content" style="padding:16px">
      <div class="skeleton skeleton-text" style="width:50%;height:14px;margin-bottom:10px"></div>
      <div class="skeleton skeleton-order"></div>
      <div class="skeleton skeleton-text" style="width:40%;height:14px;margin-bottom:10px"></div>
      <div class="skeleton-products">${'<div class="skeleton skeleton-product"></div>'.repeat(3)}</div>
    </div>
    ${renderBottomNav('home')}
  </div>`;
}

// === Show Product Detail (enhanced) ===
function showProductDetailEnhanced(productId) {
  const p = APP_DATA.products.find(pr => pr.id == productId);
  if (!p) return;
  if (p.outOfStock) { showToast('Product is out of stock', 'error'); return; }
  const qty = appState.cart[productId] || 0;
  const svg = createProductSVG(p.name, p.color);
  const imgSrc = `data:image/svg+xml,${encodeURIComponent(svg)}`;
  const fav = (appState.favorites || []).includes(productId);
  const content = `
    <div class="product-detail-modal">
      <img src="${imgSrc}" alt="${p.name}" class="product-image"/>
      <div class="product-name">${p.name}</div>
      <div class="product-price">${p.priceLabel}</div>
      <div class="product-desc">Fresh and clean gallon water refill. Premium quality for your daily hydration needs.</div>
      ${p.outOfStock ? '<div style="text-align:center;color:var(--error);font-size:12px;font-weight:600;margin-bottom:12px">⚠ Currently Out of Stock</div>' : `
      <div class="qty-selector">
        <button class="qty-btn" onclick="modalUpdateQty(${p.id},-1)">−</button>
        <span class="qty-value" id="modal-qty">${qty}</span>
        <button class="qty-btn" onclick="modalUpdateQty(${p.id},1)">+</button>
      </div>`}
      <div class="modal-actions">
        <button class="btn btn-secondary btn-sm" onclick="toggleFavorite(${p.id})">
          ${fav ? '♥ Favorited' : '♡ Favorite'}
        </button>
        ${p.outOfStock ? '' : `<button class="btn btn-primary btn-sm" onclick="addToCartFromModal(${p.id})">Add to Cart</button>`}
      </div>
    </div>`;
  showModal(content);
}

// === Quick Reorder ===
function quickReorder() {
  const lastOrder = APP_DATA.orderHistory[0];
  if (!lastOrder) return;
  showToast('Adding previous order items...', 'info', 1000);
  setTimeout(() => {
    lastOrder.items.forEach(item => {
      const product = APP_DATA.products.find(p => p.name.toLowerCase().includes(item.name.toLowerCase().split(' ')[0]));
      if (product) appState.cart[product.id] = item.qty || 1;
    });
    showToast('Items added! Redirecting to checkout...', 'success');
    setTimeout(() => navigate('#checkout'), 800);
  }, 1000);
}

// === Address Validation ===
function validateAddress() {
  const input = document.getElementById('input-co-address');
  if (!input) return true;
  const val = input.value.trim();
  const group = input.closest('.form-group') || input.parentElement;
  const existing = group.querySelector('.address-validation-msg');
  if (existing) existing.remove();
  if (val.length < 10) {
    input.classList.add('address-invalid');
    input.classList.remove('address-valid');
    const msg = document.createElement('div');
    msg.className = 'address-validation-msg invalid';
    msg.textContent = '⚠ Address must be at least 10 characters';
    group.appendChild(msg);
    return false;
  }
  input.classList.remove('address-invalid');
  input.classList.add('address-valid');
  const msg = document.createElement('div');
  msg.className = 'address-validation-msg valid';
  msg.textContent = '✓ Address looks valid';
  group.appendChild(msg);
  return true;
}

// === Payment Success/Failed States ===
function renderPaymentSuccess() {
  const txnId = 'TXN-' + Date.now().toString(36).toUpperCase();
  return `<div class="screen payment-status-screen">
    <div class="payment-status">
      <div class="status-icon success">✓</div>
      <h2>Payment Successful!</h2>
      <p>Your payment has been verified and your order is being processed.</p>
      <div class="txn-id">Transaction ID: ${txnId}</div>
      <a href="#order-detail" class="btn btn-primary" style="max-width:260px">Track Order</a>
      <a href="#home" class="btn-cancel-text">Return to Home</a>
    </div>
  </div>`;
}

function renderPaymentFailed() {
  return `<div class="screen payment-status-screen">
    <div class="payment-status">
      <div class="status-icon failed">✕</div>
      <h2>Payment Failed</h2>
      <p>Something went wrong with your payment. Please try again or choose a different payment method.</p>
      <a href="#payment-method" class="btn btn-primary" style="max-width:260px">Try Again</a>
      <a href="#home" class="btn-cancel-text">Return to Home</a>
    </div>
  </div>`;
}

// === Checkout Loading State ===
function processCheckoutPayment() {
  const btn = document.getElementById('checkout-order-btn');
  if (!btn) return;
  setButtonLoading(btn, true);
  btn.textContent = '';
  setTimeout(() => {
    setButtonLoading(btn, false);
    navigate('#order-success');
  }, 2000);
}

// === Order Filtering ===
function setOrderFilter(filter) {
  appState.orderFilter = filter;
  const chips = document.querySelectorAll('.order-filter-chip');
  chips.forEach(c => c.classList.toggle('active', c.dataset.filter === filter));
}

// === Order Detail Modal ===
function showOrderDetailModal(orderId) {
  const order = APP_DATA.orderHistory.find(o => o.id === orderId) || APP_DATA.currentOrder;
  if (!order) return;
  const content = `
    <div class="order-detail-modal">
      <div class="modal-handle"></div>
      <div class="order-id">Order #${order.id}</div>
      <div class="order-date">${order.date}</div>
      <div class="detail-row"><span>Courier</span><span>${order.courier.name}</span></div>
      <div class="detail-row"><span>Address</span><span style="text-align:right;max-width:180px">${order.address}</span></div>
      <div class="detail-row"><span>Payment</span><span>${order.paymentMethod}</span></div>
      <div class="detail-row"><span>Status</span><span style="color:${order.status === 'Completed' ? 'var(--accent-green)' : 'var(--primary-blue)'};font-weight:600">${order.status}</span></div>
      <div class="detail-row total"><span>Total</span><span>${order.total}</span></div>
      <div class="modal-actions" style="margin-top:14px">
        <button class="btn btn-secondary btn-sm" onclick="closeModal()">Close</button>
        ${order.status === 'Completed' ? '<button class="btn btn-primary btn-sm" onclick="closeModal();navigate(\'#feedback\')">Give Feedback</button>' : '<button class="btn btn-primary btn-sm" onclick="closeModal();navigate(\'#order-detail\')">Track Order</button>'}
      </div>
    </div>`;
  showModal(content);
}

// === Chat Image Preview ===
function handleChatImageSelect() {
  const input = document.createElement('input');
  input.type = 'file'; input.accept = 'image/*';
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      appState.chatImagePreview = ev.target.result;
      const existing = document.querySelector('.image-preview-bar');
      if (existing) existing.remove();
      const bar = document.createElement('div');
      bar.className = 'image-preview-bar';
      bar.innerHTML = `<img src="${ev.target.result}" alt="Preview"/><div class="preview-info">${file.name}</div><button class="remove-preview" onclick="removeChatImagePreview()">✕</button>`;
      document.querySelector('.conversation-screen')?.appendChild(bar);
    };
    reader.readAsDataURL(file);
  };
  input.click();
}

function removeChatImagePreview() {
  appState.chatImagePreview = null;
  document.querySelector('.image-preview-bar')?.remove();
}

// === Feedback Image Upload ===
function handleFeedbackImageUpload() {
  const input = document.createElement('input');
  input.type = 'file'; input.accept = 'image/*';
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      appState.feedbackImage = ev.target.result;
      const preview = document.querySelector('.feedback-upload-preview');
      const btn = document.querySelector('.feedback-upload-btn');
      if (btn) btn.style.display = 'none';
      if (preview) {
        preview.innerHTML = `<img src="${ev.target.result}" alt="Feedback"/><button class="remove-preview" onclick="removeFeedbackImage()" style="position:absolute;top:-4px;right:-4px;width:18px;height:18px;font-size:10px">✕</button>`;
        preview.style.display = 'block';
      }
      showToast('Image attached', 'success');
    };
    reader.readAsDataURL(file);
  };
  input.click();
}

function removeFeedbackImage() {
  appState.feedbackImage = null;
  const preview = document.querySelector('.feedback-upload-preview');
  const btn = document.querySelector('.feedback-upload-btn');
  if (preview) { preview.innerHTML = ''; preview.style.display = 'none'; }
  if (btn) btn.style.display = 'flex';
}

// === Animated Star Rating ===
const origSetRating = window.setRating;
window.setRating = function(r) {
  appState.rating = r;
  const stars = document.querySelectorAll('.star-rating .star');
  stars.forEach((s, i) => {
    if (i < r) {
      s.classList.add('active');
      s.style.animationDelay = `${i * 60}ms`;
    } else {
      s.classList.remove('active');
    }
  });
  const response = document.querySelector('.feedback-response');
  const texts = ['', 'Terrible experience', 'Bad experience', 'Okay experience', 'Fantastic service!', 'Outstanding service!'];
  if (response) response.textContent = texts[r] || '';
};

// === Profile Picture Upload ===
function handleProfilePicUpload() {
  const input = document.createElement('input');
  input.type = 'file'; input.accept = 'image/*';
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      appState.profilePic = ev.target.result;
      const avatar = document.querySelector('.edit-profile-avatar .avatar, .edit-profile-avatar .avatar-2xl');
      if (avatar) { avatar.src = ev.target.result; }
      showToast('Profile picture updated', 'success');
    };
    reader.readAsDataURL(file);
  };
  input.click();
}

// === Notification Preferences Modal ===
function showNotificationPrefs() {
  const content = `
    <div class="modal-title">Notification Preferences</div>
    <div class="notification-pref">
      <div class="pref-item"><div><div class="pref-label">Order Updates</div><div class="pref-desc">Get notified about order status</div></div><div class="toggle active" onclick="this.classList.toggle('active')"></div></div>
      <div class="pref-item"><div><div class="pref-label">Promotions</div><div class="pref-desc">Receive promo & discount alerts</div></div><div class="toggle active" onclick="this.classList.toggle('active')"></div></div>
      <div class="pref-item"><div><div class="pref-label">Chat Messages</div><div class="pref-desc">New message notifications</div></div><div class="toggle active" onclick="this.classList.toggle('active')"></div></div>
      <div class="pref-item"><div><div class="pref-label">Delivery Alerts</div><div class="pref-desc">Courier arrival notifications</div></div><div class="toggle" onclick="this.classList.toggle('active')"></div></div>
    </div>
    <div class="modal-actions"><button class="btn btn-primary btn-sm" onclick="closeModal();showToast('Preferences saved','success')">Save</button></div>`;
  showModal(content);
}

// === Account Security Modal ===
function showAccountSecurity() {
  const content = `
    <div class="modal-title">Account Security</div>
    <div class="modal-subtitle">Manage your security settings</div>
    <div class="security-item">
      <div class="security-icon">${ICONS.lock}</div>
      <div class="security-info"><h4>Password</h4><p>Last changed 30 days ago</p></div>
      <span class="security-status on">Active</span>
    </div>
    <div class="security-item">
      <div class="security-icon">${ICONS.shield}</div>
      <div class="security-info"><h4>Two-Factor Auth</h4><p>Extra layer of security</p></div>
      <span class="security-status off">Off</span>
    </div>
    <div class="security-item">
      <div class="security-icon">${ICONS.phone}</div>
      <div class="security-info"><h4>Phone Verification</h4><p>+62 812-****-7890</p></div>
      <span class="security-status on">Verified</span>
    </div>
    <div class="modal-actions"><button class="btn btn-secondary btn-sm" onclick="closeModal()">Close</button><button class="btn btn-primary btn-sm" onclick="closeModal();showChangePassword()">Change Password</button></div>`;
  showModal(content);
}

// === Delivery Status Toggle ===
function toggleDeliveryStatus(status) {
  appState.deliveryStatus = status;
  renderCurrentScreen();
}

// === Enhanced Checkout Confirmation ===
function confirmCheckoutEnhanced() {
  const { count, total } = getCartTotal();
  if (count === 0) { showToast('Your cart is empty', 'error'); return; }
  const notes = document.getElementById('delivery-notes')?.value || '';
  const promo = document.getElementById('promo-input')?.value || '';
  showConfirm('Confirm Order', `Place order for ${count} gallon(s) totaling Rp ${(total + 3000).toLocaleString('id-ID')}?${notes ? '\n\nNote: ' + notes : ''}`, {
    icon: '📦', iconType: 'success', confirmText: 'Place Order', cancelText: 'Review',
    onConfirm: () => {
      showToast('Processing payment...', 'info', 2000);
      setTimeout(() => navigate('#order-success'), 2200);
    }
  });
}

// === Map Loading Effect ===
function showMapWithLoading() {
  const container = document.querySelector('.map-container');
  if (!container) return;
  container.innerHTML = '<div class="map-loading"><div class="spinner"></div><p>Loading map...</p></div>';
  setTimeout(() => {
    container.innerHTML = renderMapPlaceholder().replace('<div class="map-container">', '').replace('</div>', '');
    const placeholder = container.querySelector('.map-placeholder');
    if (!placeholder) container.innerHTML = document.createElement('div').innerHTML;
  }, 1500);
}

// === Init enhancements on screen change ===
const origRenderCurrentScreen = window.renderCurrentScreen;
window.renderCurrentScreen = function() {
  const hash = window.location.hash || '';
  const fn = routes[hash] || 'renderWelcome';
  const app = document.getElementById('app');

  // Show skeleton for home on first load
  if (hash === '#home' && !appState._homeLoaded) {
    appState._homeLoaded = true;
    app.innerHTML = renderHomeSkeleton();
    setTimeout(() => {
      if (window[fn]) app.innerHTML = window[fn]();
      window.scrollTo(0, 0);
      initPullToRefresh();
    }, 1200);
    return;
  }

  if (window[fn]) app.innerHTML = window[fn]();
  window.scrollTo(0, 0);

  // Post-render hooks
  setTimeout(() => {
    if (hash === '#home') initPullToRefresh();
  }, 100);
};

// Mark products as out of stock (demo: products 8,9,10)
APP_DATA.products[7].outOfStock = true;
APP_DATA.products[8].outOfStock = true;
APP_DATA.products[9].outOfStock = true;
