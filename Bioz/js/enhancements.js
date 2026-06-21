// ============================================
// BIOZFRESH — Enhancement Interactions
// ============================================

// === Toast System ===
function showToast(message, type = 'info', duration = 2500) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const icons = { success: '✓', error: '✕', info: 'ℹ' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type] || ''}</span>${message}`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('hiding');
    setTimeout(() => toast.remove(), 250);
  }, duration);
}

// === Modal System ===
function showModal(content, opts = {}) {
  const { center = false, onClose } = opts;
  const overlay = document.createElement('div');
  overlay.className = `modal-overlay${center ? ' center' : ''}`;
  overlay.innerHTML = `<div class="modal">${center ? '' : '<div class="modal-handle"></div>'}${content}</div>`;
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal(overlay, onClose);
  });
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';
  return overlay;
}

function closeModal(overlay, onClose) {
  if (!overlay) overlay = document.querySelector('.modal-overlay');
  if (!overlay) return;
  const modal = overlay.querySelector('.modal');
  if (modal) modal.classList.add('closing');
  overlay.style.animation = 'fadeOut 200ms ease forwards';
  setTimeout(() => {
    overlay.remove();
    document.body.style.overflow = '';
    if (onClose) onClose();
  }, 200);
}

// === Confirm Modal ===
function showConfirm(title, message, opts = {}) {
  const { icon = '⚠️', iconType = 'warning', confirmText = 'Confirm', cancelText = 'Cancel', onConfirm, onCancel, danger = false } = opts;
  const content = `
    <div class="confirm-modal-icon ${iconType}">${icon}</div>
    <div class="modal-title">${title}</div>
    <div class="modal-subtitle">${message}</div>
    <div class="modal-actions">
      <button class="btn btn-secondary btn-sm" onclick="closeModal()">${cancelText}</button>
      <button class="btn ${danger ? 'btn-danger' : 'btn-primary'} btn-sm" id="confirm-action-btn">${confirmText}</button>
    </div>`;
  const overlay = showModal(content, { center: true });
  overlay.querySelector('#confirm-action-btn').addEventListener('click', () => {
    closeModal(overlay);
    if (onConfirm) onConfirm();
  });
}

// === Product Detail Modal ===
function showProductDetail(productId) {
  const p = APP_DATA.products.find(pr => pr.id == productId);
  if (!p) return;
  const qty = appState.cart[productId] || 0;
  const svg = createProductSVG(p.name, p.color);
  const imgSrc = `data:image/svg+xml,${encodeURIComponent(svg)}`;
  const fav = (appState.favorites || []).includes(productId);
  
  if (!appState.cartTypes) appState.cartTypes = {};
  const currentType = appState.cartTypes[productId] || 'refill';
  const displayPrice = currentType === 'new' ? p.price + 15000 : p.price;
  
  const refillStyle = currentType === 'refill' 
    ? 'border: 1.5px solid var(--primary-blue); background: rgba(43, 45, 130, 0.05); color: var(--primary-blue);' 
    : 'border: 1.5px solid var(--border-color); background: var(--white); color: var(--text-secondary);';
  
  const newStyle = currentType === 'new' 
    ? 'border: 1.5px solid var(--primary-blue); background: rgba(43, 45, 130, 0.05); color: var(--primary-blue);' 
    : 'border: 1.5px solid var(--border-color); background: var(--white); color: var(--text-secondary);';

  const content = `
    <div class="product-detail-modal" style="text-align: left; padding: 8px 4px;">
      <div style="position: relative; display: flex; justify-content: center; margin-bottom: 16px;">
        <img src="${imgSrc}" alt="${p.name}" class="product-image" style="height: 140px; object-fit: contain; margin: 0 auto; display: block;"/>
        <span style="position: absolute; top: 0; right: 0; background: rgba(76, 175, 80, 0.1); color: var(--success); font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 9999px;">Tersedia</span>
      </div>
      
      <div class="product-name" style="font-family: var(--font-primary); font-weight: 700; font-size: 20px; color: var(--text-primary); margin-bottom: 4px; text-align: left;">${p.name} (19L)</div>
      
      <div class="product-price" id="modal-product-price" style="font-family: var(--font-primary); font-weight: 800; font-size: 18px; color: var(--primary-blue); margin-bottom: 16px; text-align: left;">Rp ${displayPrice.toLocaleString('id-ID')}</div>
      
      <div class="divider" style="margin: 12px 0;"></div>

      <div style="margin-bottom: 16px;">
        <h4 style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: var(--text-secondary); margin-bottom: 8px; letter-spacing: 0.5px;">Informasi Produk</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px; color: var(--text-primary);">
          <div style="background: var(--bg-light); padding: 8px 12px; border-radius: 8px;"><strong>Volume:</strong> 19 Liter</div>
          <div style="background: var(--bg-light); padding: 8px 12px; border-radius: 8px;"><strong>Material:</strong> BPA Free</div>
          <div style="background: var(--bg-light); padding: 8px 12px; border-radius: 8px;"><strong>Sumber Air:</strong> Pegunungan</div>
          <div style="background: var(--bg-light); padding: 8px 12px; border-radius: 8px;"><strong>Sertifikasi:</strong> BPOM RI</div>
        </div>
      </div>

      <div style="margin-bottom: 20px;">
        <h4 style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: var(--text-secondary); margin-bottom: 8px; letter-spacing: 0.5px;">Tipe Pemesanan</h4>
        <div style="display: flex; gap: 10px;">
          <button id="btn-type-refill" onclick="setModalOrderType(${p.id}, 'refill', ${p.price})" style="flex: 1; padding: 12px; border-radius: 12px; cursor: pointer; transition: all 0.2s ease; ${refillStyle}">
            <div style="font-weight: 700; font-size: 13px;">Isi Ulang</div>
            <div style="font-size: 10px; margin-top: 2px; opacity: 0.8;">Bawa Galon Sendiri</div>
            <div style="font-size: 12px; font-weight: 700; margin-top: 4px;">Rp ${p.price.toLocaleString('id-ID')}</div>
          </button>
          <button id="btn-type-new" onclick="setModalOrderType(${p.id}, 'new', ${p.price})" style="flex: 1; padding: 12px; border-radius: 12px; cursor: pointer; transition: all 0.2s ease; ${newStyle}">
            <div style="font-weight: 700; font-size: 13px;">Galon Baru</div>
            <div style="font-size: 10px; margin-top: 2px; opacity: 0.8;">Termasuk Galon Baru</div>
            <div style="font-size: 12px; font-weight: 700; margin-top: 4px;">Rp ${(p.price + 15000).toLocaleString('id-ID')}</div>
          </button>
        </div>
      </div>

      <div style="display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-top: 12px;">
        <div class="qty-selector" style="display: flex; align-items: center; gap: 12px; background: #eef2ff; padding: 6px 14px; border-radius: 9999px; margin-bottom: 0;">
          <button class="qty-btn" onclick="modalUpdateQty(${p.id},-1)" style="border: none; background: none; font-size: 18px; font-weight: bold; color: var(--primary-blue); cursor: pointer;">−</button>
          <span class="qty-value" id="modal-qty" style="font-size: 16px; font-weight: 700; color: var(--primary-blue); min-width: 20px; text-align: center;">${qty}</span>
          <button class="qty-btn" onclick="modalUpdateQty(${p.id},1)" style="border: none; background: none; font-size: 18px; font-weight: bold; color: var(--primary-blue); cursor: pointer;">+</button>
        </div>
        <button class="btn btn-primary" onclick="addToCartFromModal(${p.id})" style="flex: 1; border-radius: 9999px; padding: 12px; background: var(--primary-blue); font-family: var(--font-primary); font-weight: 700; color: white;">Tambah ke Keranjang</button>
      </div>
    </div>`;
  showModal(content);
}

function setModalOrderType(productId, type, basePrice) {
  if (!appState.cartTypes) appState.cartTypes = {};
  appState.cartTypes[productId] = type;
  
  const refillBtn = document.getElementById('btn-type-refill');
  const newBtn = document.getElementById('btn-type-new');
  const priceEl = document.getElementById('modal-product-price');
  
  if (type === 'refill') {
    refillBtn.style.borderColor = 'var(--primary-blue)';
    refillBtn.style.background = 'rgba(43, 45, 130, 0.05)';
    refillBtn.style.color = 'var(--primary-blue)';
    
    newBtn.style.borderColor = 'var(--border-color)';
    newBtn.style.background = 'var(--white)';
    newBtn.style.color = 'var(--text-secondary)';
    
    if (priceEl) priceEl.textContent = `Rp ${basePrice.toLocaleString('id-ID')}`;
  } else {
    newBtn.style.borderColor = 'var(--primary-blue)';
    newBtn.style.background = 'rgba(43, 45, 130, 0.05)';
    newBtn.style.color = 'var(--primary-blue)';
    
    refillBtn.style.borderColor = 'var(--border-color)';
    refillBtn.style.background = 'var(--white)';
    refillBtn.style.color = 'var(--text-secondary)';
    
    if (priceEl) priceEl.textContent = `Rp ${(basePrice + 15000).toLocaleString('id-ID')}`;
  }
}

function modalUpdateQty(id, delta) {
  const current = appState.cart[id] || 0;
  const newQty = Math.max(0, current + delta);
  if (newQty === 0) delete appState.cart[id];
  else appState.cart[id] = newQty;
  const el = document.getElementById('modal-qty');
  if (el) { el.textContent = newQty; el.style.animation = 'none'; el.offsetHeight; el.style.animation = 'checkmarkPop 200ms ease'; }
}

function addToCartFromModal(id) {
  if (!appState.cart[id]) appState.cart[id] = 1;
  closeModal();
  showToast('Added to cart!', 'success');
  renderCurrentScreen();
}

// === Favorites ===
function toggleFavorite(id) {
  if (!appState.favorites) appState.favorites = [];
  const idx = appState.favorites.indexOf(id);
  if (idx > -1) { appState.favorites.splice(idx, 1); showToast('Removed from favorites', 'info'); }
  else { appState.favorites.push(id); showToast('Added to favorites ♥', 'success'); }
  closeModal();
  renderCurrentScreen();
}

// === Password Visibility Toggle ===
function togglePassword(inputId) {
  const input = document.getElementById(inputId);
  if (!input) return;
  input.type = input.type === 'password' ? 'text' : 'password';
  const btn = input.parentElement.querySelector('.password-toggle');
  if (btn) btn.innerHTML = input.type === 'password' ? ICONS.eyeOff || '👁' : ICONS.eye || '👁‍🗨';
}

// === Form Validation ===
function validateField(inputId, rules = {}) {
  const input = document.getElementById(inputId);
  if (!input) return true;
  const group = input.closest('.form-group');
  const value = input.value.trim();
  let error = '';
  if (rules.required && !value) error = 'This field is required';
  else if (rules.email && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Invalid email address';
  else if (rules.minLength && value.length < rules.minLength) error = `Minimum ${rules.minLength} characters`;
  else if (rules.phone && value && !/^[\d\s\-+()]{8,}$/.test(value)) error = 'Invalid phone number';
  if (error) {
    group.classList.add('error'); group.classList.remove('success');
    let errEl = group.querySelector('.form-error');
    if (!errEl) { errEl = document.createElement('div'); errEl.className = 'form-error'; group.appendChild(errEl); }
    errEl.textContent = error; errEl.style.display = 'block';
    return false;
  }
  group.classList.remove('error'); group.classList.add('success');
  const errEl = group.querySelector('.form-error');
  if (errEl) errEl.style.display = 'none';
  return true;
}

// === Loading Button ===
function setButtonLoading(btn, loading) {
  if (typeof btn === 'string') btn = document.querySelector(btn);
  if (!btn) return;
  if (loading) {
    btn.dataset.originalText = btn.textContent;
    btn.innerHTML = `<span class="btn-text" style="opacity:0">${btn.textContent}</span>`;
    btn.classList.add('loading');
  } else {
    btn.textContent = btn.dataset.originalText || '';
    btn.classList.remove('loading');
  }
}

// === Skeleton Loader ===
function renderSkeleton(type = 'card') {
  if (type === 'card') {
    return `<div class="skeleton skeleton-card"></div>`.repeat(3);
  }
  if (type === 'chat') {
    return `<div style="display:flex;gap:10px;padding:10px 0">
      <div class="skeleton skeleton-circle skeleton-avatar"></div>
      <div style="flex:1"><div class="skeleton skeleton-text"></div><div class="skeleton skeleton-text short"></div></div>
    </div>`.repeat(4);
  }
  if (type === 'product') {
    return `<div class="skeleton" style="height:160px;border-radius:12px"></div>`.repeat(4);
  }
  return '';
}

// === Typing Indicator ===
function showTypingIndicator() {
  return `<div class="chat-bubble received typing-indicator">
    <div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>
  </div>`;
}

// === Order Timeline ===
function renderOrderTimeline(status) {
  const steps = [
    { label: 'Order Placed', desc: 'Your order has been received', time: '09:10' },
    { label: 'Order Confirmed', desc: 'Payment verified', time: '09:15' },
    { label: 'On The Way', desc: 'Courier is delivering', time: '09:30' },
    { label: 'Delivered', desc: 'Order delivered successfully', time: '' },
  ];
  const statusMap = { 'placed': 1, 'confirmed': 2, 'on-the-way': 3, 'delivered': 4 };
  const activeStep = statusMap[status] || 2;
  return `<div class="timeline">${steps.map((s, i) => {
    const state = i < activeStep ? 'completed' : i === activeStep ? 'active' : '';
    return `<div class="timeline-step ${state}">
      <div class="timeline-dot">${state === 'completed' ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>' : `<span style="font-size:8px;color:${state ? '#fff' : 'var(--gray-400)'}">${i + 1}</span>`}</div>
      <div class="timeline-content"><h4>${s.label}</h4><p>${s.desc}${s.time ? ` · ${s.time}` : ''}</p></div>
    </div>`;
  }).join('')}</div>`;
}

// === Logout Confirmation ===
function confirmLogout() {
  showConfirm('Logout', 'Are you sure you want to logout?', {
    icon: '🚪', iconType: 'warning', confirmText: 'Logout', cancelText: 'Cancel', danger: true,
    onConfirm: () => { showToast('Logged out successfully', 'info'); navigate('#login'); }
  });
}

// === Cancel Order Confirmation ===
function confirmCancelOrder() {
  showConfirm('Cancel Order', 'Are you sure you want to cancel this order? This action cannot be undone.', {
    icon: '❌', iconType: 'danger', confirmText: 'Cancel Order', cancelText: 'Keep Order', danger: true,
    onConfirm: () => { showToast('Order cancelled', 'error'); navigate('#my-orders'); }
  });
}

// === Checkout Confirmation ===
function confirmCheckout() {
  const { count, total } = getCartTotal();
  showConfirm('Confirm Order', `Place order for ${count} gallon(s) totaling Rp ${(total + 3000).toLocaleString('id-ID')}?`, {
    icon: '📦', iconType: 'success', confirmText: 'Place Order', cancelText: 'Review',
    onConfirm: () => {
      showToast('Processing order...', 'info', 1500);
      setTimeout(() => navigate('#order-success'), 1600);
    }
  });
}

// === Upload Preview ===
function handleFileUpload(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const preview = document.querySelector('.upload-area');
    if (preview) {
      preview.outerHTML = `<div class="upload-preview">
        <img src="${e.target.result}" alt="Payment proof"/>
        <div class="remove-btn" onclick="removeUpload()">✕</div>
      </div>`;
      showToast('Payment proof uploaded', 'success');
    }
  };
  reader.readAsDataURL(file);
}

function removeUpload() {
  const preview = document.querySelector('.upload-preview');
  if (preview) {
    preview.outerHTML = renderUploadArea();
    showToast('Upload removed', 'info');
  }
}

// === Order Tabs ===
function setOrderTab(tab) {
  appState.orderTab = tab;
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelector(`.tab[data-tab="${tab}"]`)?.classList.add('active');
  const activeContent = document.getElementById('orders-active');
  const historyContent = document.getElementById('orders-history');
  if (activeContent) activeContent.style.display = tab === 'active' ? 'block' : 'none';
  if (historyContent) historyContent.style.display = tab === 'history' ? 'block' : 'none';
}

// === Chat Auto-scroll on new message ===
const originalSendMessage = window.sendMessage;
window.sendMessage = function() {
  const input = document.getElementById('chat-input');
  if (!input || !input.value.trim()) return;
  const chatData = APP_DATA.chatMessages[appState.currentChat];
  if (!chatData) return;
  chatData.messages.push({
    id: Date.now(), text: input.value.trim(), sent: true,
    time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    date: chatData.messages[chatData.messages.length - 1]?.date || 'Today'
  });
  input.value = '';
  renderCurrentScreen();
  setTimeout(() => {
    const msgs = document.querySelector('.conversation-messages');
    if (msgs) msgs.scrollTo({ top: msgs.scrollHeight, behavior: 'smooth' });
    // Show typing indicator after a delay
    setTimeout(() => {
      const typingEl = document.createElement('div');
      typingEl.innerHTML = showTypingIndicator();
      const container = document.querySelector('.conversation-messages');
      if (container) {
        container.appendChild(typingEl.firstChild);
        container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
        // Auto-reply
        setTimeout(() => {
          const typingBubble = container.querySelector('.typing-indicator');
          if (typingBubble) typingBubble.remove();
          chatData.messages.push({
            id: Date.now(), text: getAutoReply(), sent: false,
            time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
            date: chatData.messages[chatData.messages.length - 1]?.date || 'Today'
          });
          renderCurrentScreen();
          setTimeout(() => {
            const m = document.querySelector('.conversation-messages');
            if (m) m.scrollTo({ top: m.scrollHeight, behavior: 'smooth' });
          }, 50);
        }, 1800);
      }
    }, 800);
  }, 50);
};

function getAutoReply() {
  const replies = ['Baik, akan segera diproses 👍', 'Terima kasih, pesanan sudah dicatat', 'Siap, segera diantar ya!', 'Sudah kami catat. Ada yang lain?', 'Ok, ditunggu ya! 🚀'];
  return replies[Math.floor(Math.random() * replies.length)];
}

// === Enhanced updateQty with animation ===
const originalUpdateQty = window.updateQty;
window.updateQty = function(productId, delta) {
  const current = appState.cart[productId] || 0;
  const newQty = Math.max(0, current + delta);
  if (newQty === 0) delete appState.cart[productId];
  else appState.cart[productId] = newQty;
  // Find and animate the qty value
  const card = document.querySelector(`.product-card[data-id="${productId}"]`);
  if (card) {
    const qtyEl = card.querySelector('.product-qty-value');
    if (qtyEl) { qtyEl.style.animation = 'none'; qtyEl.offsetHeight; qtyEl.style.animation = 'checkmarkPop 200ms ease'; }
  }
  renderCurrentScreen();
};

// === Add eye icons to ICONS ===
ICONS.eye = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
ICONS.eyeOff = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';
ICONS.heart = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>';
ICONS.heartFilled = '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>';

// === Setup file upload listener ===
document.addEventListener('change', (e) => {
  if (e.target.id === 'file-upload') handleFileUpload(e.target);
});
