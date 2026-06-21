// ============================================
// BIOZFRESH — Reusable UI Components
// ============================================

function renderLogo(size = 'md') {
  const sizes = { sm: 20, md: 24, lg: 32 };
  const fs = sizes[size] || 24;
  return `<span class="logo-text" style="font-size:${fs}px">bio<span class="z">z</span>fresh</span>`;
}

function renderTopNav(title, opts = {}) {
  const { showBack = true, rightHTML = '', dark = false, transparent = false } = opts;
  const cls = `top-nav${dark ? ' dark' : ''}${transparent ? ' transparent' : ''}`;
  return `<nav class="${cls}">
    ${showBack ? `<button class="top-nav-back" onclick="goBack()">${ICONS.back}</button>` : '<div style="width:36px"></div>'}
    <span class="top-nav-title"${dark ? ' style="color:#fff"' : ''}>${title}</span>
    <div class="top-nav-right">${rightHTML}</div>
  </nav>`;
}

function renderBottomNav(active = 'home') {
  const unreadCount = APP_DATA.chatContacts.reduce((sum, c) => sum + (c.unread || 0), 0);
  const items = [
    { key: 'home', label: 'Home', icon: ICONS.home, route: '#home', badge: 0 },
    { key: 'chat', label: 'Chat', icon: ICONS.chat, route: '#messages', badge: unreadCount },
    { key: 'order', label: '', icon: ICONS.plus, route: '#orders' },
    { key: 'myorders', label: 'My Orders', icon: ICONS.orders, route: '#my-orders', badge: 0 },
    { key: 'profile', label: 'Profile', icon: ICONS.profile, route: '#profile', badge: 0 },
  ];
  return `<nav class="bottom-nav">${items.map(i => {
    if (i.key === 'order') {
      return `<a href="${i.route}" class="bottom-nav-center" id="nav-order">${i.icon}</a>`;
    }
    return `<a href="${i.route}" class="bottom-nav-item${active === i.key ? ' active' : ''}" id="nav-${i.key}" style="position:relative">
      ${i.icon}${i.badge > 0 ? `<span class="nav-badge">${i.badge}</span>` : ''}<span>${i.label}</span>
    </a>`;
  }).join('')}</nav>`;
}

function renderProductCard(product, qty = 0) {
  const svg = createProductSVG(product.name, product.color);
  const imgSrc = `data:image/svg+xml,${encodeURIComponent(svg)}`;
  return `<div class="product-card" data-id="${product.id}">
    <img src="${imgSrc}" alt="${product.name}" class="product-card-image"/>
    <div class="product-card-name">${product.name}</div>
    <div class="product-card-price">
      <span>${product.priceLabel}</span>
      ${qty > 0 ? `
        <div class="product-qty-controls">
          <button class="product-qty-btn minus" onclick="updateQty(${product.id},-1)">−</button>
          <span class="product-qty-value">${qty}</span>
          <button class="product-qty-btn plus" onclick="updateQty(${product.id},1)">+</button>
        </div>` : `
        <button class="product-add-btn" onclick="updateQty(${product.id},1)">+</button>`}
    </div>
  </div>`;
}

function renderAvatar(name, size = '', color = '#2B2D82') {
  const initials = name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
  const svg = createAvatarSVG(initials, color);
  const src = `data:image/svg+xml,${encodeURIComponent(svg)}`;
  return `<img src="${src}" alt="${name}" class="avatar${size ? ' avatar-' + size : ''}" />`;
}

function renderFormGroup(label, type, placeholder, name, value = '') {
  return `<div class="form-group">
    <label class="form-label">${label}</label>
    <input type="${type}" class="form-input" placeholder="${placeholder}" name="${name}" value="${value}" id="input-${name}" />
  </div>`;
}

function renderStarRating(rating = 0) {
  let stars = '';
  for (let i = 1; i <= 5; i++) {
    stars += `<span class="star${i <= rating ? ' active' : ''}" data-star="${i}" onclick="setRating(${i})">${ICONS.star}</span>`;
  }
  return `<div class="star-rating">${stars}</div>`;
}

function renderChatBubble(msg) {
  const cls = msg.sent ? 'sent' : 'received';
  const readIcon = msg.sent ? '<span style="font-size:10px">✓✓</span>' : '';
  let content = '';
  if (msg.image) {
    content = `<div class="chat-bubble-image" style="width:180px;height:120px;background:var(--gray-200);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:11px;color:var(--text-muted)">📷 Photo</div>`;
  }
  content += msg.text ? `<div>${msg.text}</div>` : '';
  return `<div class="chat-bubble ${cls}">
    ${content}
    <div class="chat-bubble-time">${msg.time} ${readIcon}</div>
  </div>`;
}

function renderSettingItem(icon, label, opts = {}) {
  const { toggle = false, toggleActive = false, arrow = true, danger = false, onClick = '' } = opts;
  return `<div class="setting-item" ${onClick ? `onclick="${onClick}"` : ''}>
    <div class="setting-item-left">
      <span style="${danger ? 'color:var(--error)' : ''}">${icon}</span>
      <span class="setting-item-label" style="${danger ? 'color:var(--error)' : ''}">${label}</span>
    </div>
    ${toggle ? `<div class="toggle${toggleActive ? ' active' : ''}" onclick="this.classList.toggle('active');event.stopPropagation()"></div>` :
      arrow ? `<span class="setting-item-arrow">${ICONS.chevronRight}</span>` : ''}
  </div>`;
}

function renderRadioOption(label, selected = false, groupName = 'radio', value = '') {
  return `<div class="radio-option${selected ? ' selected' : ''}" onclick="selectRadio(this,'${groupName}')">
    <div class="radio-circle"><div class="radio-circle-inner"></div></div>
    <span class="radio-label">${label}</span>
  </div>`;
}

function selectRadio(el, groupName) {
  el.parentElement.querySelectorAll('.radio-option').forEach(r => r.classList.remove('selected'));
  el.classList.add('selected');
}

function renderUploadArea() {
  return `<div class="upload-area" onclick="document.getElementById('file-upload').click()">
    ${ICONS.upload}
    <p>Click to upload payment proof</p>
    <span class="upload-hint">PNG, JPG up to 5MB</span>
    <input type="file" id="file-upload" style="display:none" accept="image/*" />
  </div>`;
}

function renderMapPlaceholder() {
  return `<div class="map-container">
    <div class="map-placeholder" style="background:linear-gradient(135deg,#e3f0ff,#c8dff8);position:relative;overflow:hidden">
      <svg viewBox="0 0 400 250" style="width:100%;height:100%;position:absolute;top:0;left:0" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="250" fill="#e8f0e8"/>
        <path d="M0,200 Q100,180 200,190 T400,185" fill="#c8d8c0" opacity=".5"/>
        <rect x="50" y="80" width="60" height="40" rx="3" fill="#d4d4d4" opacity=".6"/>
        <rect x="140" y="60" width="40" height="60" rx="3" fill="#c8c8c8" opacity=".6"/>
        <rect x="200" y="90" width="70" height="35" rx="3" fill="#d0d0d0" opacity=".6"/>
        <rect x="290" y="70" width="50" height="50" rx="3" fill="#d4d4d4" opacity=".6"/>
        <line x1="0" y1="140" x2="400" y2="140" stroke="#aaa" stroke-width="2" opacity=".4"/>
        <line x1="0" y1="160" x2="400" y2="155" stroke="#bbb" stroke-width="1.5" opacity=".3"/>
        <line x1="180" y1="0" x2="180" y2="250" stroke="#aaa" stroke-width="1.5" opacity=".3"/>
        <circle cx="200" cy="125" r="8" fill="#2B2D82"/>
        <circle cx="200" cy="125" r="4" fill="white"/>
        <text x="200" y="115" text-anchor="middle" font-size="10" fill="#2B2D82">📍</text>
      </svg>
    </div>
  </div>`;
}

function renderOrderStatusCard(order) {
  return `<div class="order-card">
    <div class="order-card-header">
      ${renderAvatar(order.courier.name, '', '#3B82F6')}
      <div class="order-card-info">
        <h4>${order.courier.name}</h4>
        <p>${order.courier.phone}</p>
      </div>
    </div>
    <div class="order-card-details">
      <div class="order-card-detail-row"><span>📍 ${order.address}</span></div>
      <div class="order-card-detail-row"><span>📅 ${order.date}</span><span>${order.total}</span></div>
    </div>
    <div class="order-card-actions">
      <button class="btn btn-sm btn-success" onclick="navigate('#order-detail')">Track Order</button>
      <button class="btn btn-sm btn-danger" onclick="confirmCancelOrder()">Cancel Order</button>
    </div>
  </div>`;
}
