// ============================================
// Screens Part 2: Orders, Checkout, Location, Payment (Enhanced)
// ============================================

function renderOrders() {
  const { count, total } = getCartTotal();
  
  // Sort & Filter logic
  let filtered = [...APP_DATA.products];
  const currentFilter = appState.productFilter || 'all';
  if (currentFilter === 'refill') {
    filtered = filtered.filter(p => p.price <= 15000);
  } else if (currentFilter === 'new') {
    filtered = filtered.filter(p => p.price > 15000);
  } else if (currentFilter === 'promo') {
    filtered = filtered.filter(p => p.id === 5 || p.id === 6 || p.id === 2);
  }

  const currentSort = appState.productSort || 'popular';
  if (currentSort === 'low') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (currentSort === 'high') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (currentSort === 'popular') {
    filtered.sort((a, b) => a.id - b.id);
  }

  return `<div class="screen with-top-nav orders-screen" style="padding-bottom:${count > 0 ? '80px' : '0'}">
    ${renderTopNav('', { rightHTML: `<span class="nav-icon" style="position:relative">${ICONS.cart}${count > 0 ? `<span class="notification-dot"></span>` : ''}</span>` })}
    <div class="orders-header" style="padding-top:12px; margin-bottom: 12px;">
      <h1>Choose your<br>Freshness</h1>
    </div>

    <!-- Filter & Sort Section -->
    <div class="filter-sort-section" style="padding: 0 16px 12px; display: flex; flex-direction: column; gap: 8px;">
      <div style="display: flex; flex-direction: column; gap: 4px;">
        <span style="font-size: 10px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px;">Filter Kategori</span>
        <div class="filter-pills" style="display: flex; gap: 6px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: none;">
          ${[
            { key: 'all', label: 'Semua' },
            { key: 'refill', label: 'Air Isi Ulang' },
            { key: 'new', label: 'Galon Baru' },
            { key: 'promo', label: 'Promo' }
          ].map(f => {
            const active = currentFilter === f.key;
            return `<button onclick="setProductFilter('${f.key}')" style="padding: 6px 12px; border-radius: 9999px; font-size: 11px; font-weight: 600; white-space: nowrap; border: 1.5px solid ${active ? 'var(--primary-blue)' : 'var(--border-color)'}; background: ${active ? 'var(--primary-blue)' : 'var(--white)'}; color: ${active ? 'var(--white)' : 'var(--text-secondary)'}; transition: all 0.2s ease;">${f.label}</button>`;
          }).join('')}
        </div>
      </div>

      <div style="display: flex; flex-direction: column; gap: 4px; margin-top: 4px;">
        <span style="font-size: 10px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px;">Urutkan Harga</span>
        <div class="sort-pills" style="display: flex; gap: 6px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: none;">
          ${[
            { key: 'low', label: 'Harga Terendah' },
            { key: 'high', label: 'Harga Tertinggi' },
            { key: 'popular', label: 'Terpopuler' }
          ].map(s => {
            const active = currentSort === s.key;
            return `<button onclick="setProductSort('${s.key}')" style="padding: 6px 12px; border-radius: 9999px; font-size: 11px; font-weight: 600; white-space: nowrap; border: 1.5px solid ${active ? 'var(--primary-blue)' : 'var(--border-color)'}; background: ${active ? 'var(--primary-blue)' : 'var(--white)'}; color: ${active ? 'var(--white)' : 'var(--text-secondary)'}; transition: all 0.2s ease;">${s.label}</button>`;
          }).join('')}
        </div>
      </div>
    </div>

    <div class="orders-grid">
      ${filtered.map(p => {
        const fav = (appState.favorites || []).includes(p.id);
        const svg = createProductSVG(p.name, p.color);
        const imgSrc = `data:image/svg+xml,${encodeURIComponent(svg)}`;
        const qty = appState.cart[p.id] || 0;
        const oos = p.outOfStock;
        return `<div class="product-card${oos ? ' out-of-stock' : ''}" data-id="${p.id}" onclick="${oos ? 'showToast(\'Out of stock\',\'error\')' : 'showProductDetail(' + p.id + ')'}" style="position: relative;">
          ${qty > 0 ? `<div style="position: absolute; top: 8px; right: 8px; background: var(--primary-blue); color: white; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; z-index: 10;">${qty}</div>` : ''}
          <div class="favorite-btn${fav ? ' active' : ''}" onclick="event.stopPropagation();toggleFavorite(${p.id})">
            ${fav ? (ICONS.heartFilled || '♥') : (ICONS.heart || '♡')}
          </div>
          <img src="${imgSrc}" alt="${p.name}" class="product-card-image"/>
          <div class="product-card-name">${p.name}</div>
          <div class="product-card-price">
            <span>${p.priceLabel}</span>
            ${oos ? '<span style="font-size:9px;color:var(--error);font-weight:600">Habis</span>' : qty > 0 ? `
              <div class="product-qty-controls" onclick="event.stopPropagation()">
                <button class="product-qty-btn minus" onclick="updateQty(${p.id},-1)">−</button>
                <span class="product-qty-value">${qty}</span>
                <button class="product-qty-btn plus" onclick="updateQty(${p.id},1)">+</button>
              </div>` : `
              <button class="product-add-btn" onclick="event.stopPropagation();updateQty(${p.id},1);showToast('Added to cart','success',1200)">+</button>`}
          </div>
        </div>`;
      }).join('')}
    </div>
    ${count > 0 ? `<div class="orders-bottom-bar">
      <div class="order-summary">My Order<br><strong>Rp ${total.toLocaleString('id-ID')}</strong> · Total Gallon: ${count}</div>
      <a href="#checkout" class="btn btn-primary btn-sm" style="width:auto">Checkout</a>
    </div>` : ''}
    ${count > 0 ? `<div class="order-counter-badge">${count}</div>` : ''}
  </div>`;
}

function setProductFilter(filter) {
  appState.productFilter = filter;
  renderCurrentScreen();
}

function setProductSort(sort) {
  appState.productSort = sort;
  renderCurrentScreen();
}

function changeCheckoutItemType(productId, type) {
  if (!appState.cartTypes) appState.cartTypes = {};
  appState.cartTypes[productId] = type;
  renderCurrentScreen();
}

function renderCheckout() {
  if (!appState.cartTypes) appState.cartTypes = {};
  const { count, total } = getCartTotal();
  const items = Object.entries(appState.cart).map(([id, qty]) => {
    const p = APP_DATA.products.find(pr => pr.id == id);
    if (!p) return null;
    const type = appState.cartTypes[id] || 'refill';
    const unitPrice = type === 'new' ? p.price + 15000 : p.price;
    const itemTotal = unitPrice * qty;
    return { 
      id,
      name: p.name, 
      type,
      qty, 
      price: itemTotal 
    };
  }).filter(Boolean);
  const grandTotal = total + 3000;

  return `<div class="screen with-top-nav checkout-screen" style="padding-bottom:80px">
    ${renderTopNav('Checkout', { rightHTML: renderLogo('sm') })}
    <div style="text-align:center;padding:0 20px 8px;margin-top:4px">
      <p style="font-size:12px;color:var(--text-secondary)">Order fresh and clean water</p>
    </div>
    <div class="checkout-content">
      <div class="checkout-section">
        <div class="checkout-section-title">Make Order</div>
        <div class="checkout-section-subtitle">CUSTOMER INFORMATION</div>
        ${renderFormGroup('Full Name', 'text', 'Enter your name', 'co-name', APP_DATA.user.name)}
        ${renderFormGroup('Phone Number', 'tel', 'Enter phone number', 'co-phone', APP_DATA.user.phone)}
      </div>

      <div class="checkout-section">
        <div class="form-label">Address</div>
        <div class="checkout-address">
          ${ICONS.location}
          <p>${APP_DATA.user.address}</p>
        </div>
        <a href="#location" class="btn btn-success btn-sm" style="max-width:160px">Set Location</a>
      </div>

      <div class="checkout-section">
        <div class="checkout-section-title">Promo Code</div>
        <div class="promo-code-section">
          <input type="text" class="form-input" placeholder="Enter promo code" id="promo-input"/>
          <button class="btn btn-primary" onclick="applyPromo()">Apply</button>
        </div>
      </div>

      <div class="checkout-section">
        <div class="checkout-section-title">Delivery Notes</div>
        <textarea class="form-input" placeholder="e.g. Leave at the door, knock 2x..." style="min-height:60px;resize:none" id="delivery-notes"></textarea>
      </div>

      <div class="checkout-section" style="background: var(--white); border: 1px solid var(--border-light); border-radius: 12px; padding: 14px; margin-bottom: 16px;">
        <div class="checkout-section-title" style="margin-bottom: 12px; font-weight: 700; font-size: 13px;">Order Detail</div>
        ${items.map(item => `
          <div style="margin-bottom: 12px; border-bottom: 1px solid var(--border-light); padding-bottom: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
              <span style="font-weight: 700; font-size: 13px; color: var(--text-primary);">${item.name} (${item.qty}x)</span>
              <span style="font-weight: 700; font-size: 13px; color: var(--primary-blue);">Rp ${item.price.toLocaleString('id-ID')}</span>
            </div>
            <!-- Order Type Selection -->
            <div style="display: flex; gap: 8px; margin-top: 6px;">
              <button onclick="changeCheckoutItemType(${item.id}, 'refill')" style="flex: 1; padding: 6px 10px; border-radius: 8px; font-size: 11px; font-weight: 700; border: 1px solid ${item.type === 'refill' ? 'var(--primary-blue)' : 'var(--border-color)'}; background: ${item.type === 'refill' ? 'rgba(43,45,130,0.06)' : 'var(--white)'}; color: ${item.type === 'refill' ? 'var(--primary-blue)' : 'var(--text-secondary)'}; cursor: pointer; transition: all 0.2s ease;">Isi Ulang</button>
              <button onclick="changeCheckoutItemType(${item.id}, 'new')" style="flex: 1; padding: 6px 10px; border-radius: 8px; font-size: 11px; font-weight: 700; border: 1px solid ${item.type === 'new' ? 'var(--primary-blue)' : 'var(--border-color)'}; background: ${item.type === 'new' ? 'rgba(43,45,130,0.06)' : 'var(--white)'}; color: ${item.type === 'new' ? 'var(--primary-blue)' : 'var(--text-secondary)'}; cursor: pointer; transition: all 0.2s ease;">Galon Baru</button>
            </div>
          </div>
        `).join('')}
        <div class="checkout-detail-row" style="display: flex; justify-content: space-between; font-size: 12px; margin-top: 8px;"><span>Distance (3 km)</span><span>Rp 3.000</span></div>
        <div class="checkout-detail-row total" style="display: flex; justify-content: space-between; font-size: 14px; font-weight: 700; border-top: 1.5px solid var(--border-light); padding-top: 10px; margin-top: 8px; color: var(--primary-blue);"><span>Total</span><span>Rp ${grandTotal.toLocaleString('id-ID')}</span></div>
      </div>

      <div class="checkout-bonus">
        <span>Bonus (1 Gallon)</span>
        <div class="toggle active" onclick="this.classList.toggle('active')"></div>
      </div>

      <div class="checkout-section">
        <div class="checkout-section-title" style="margin-bottom:8px">Payment Method</div>
        <div class="checkout-payment-method" onclick="navigate('#payment-method')">
          <span>💳 ${appState.paymentMethod === 'transfer' ? 'Transfer Bank' : 'Cash'}</span>
          ${ICONS.chevronRight}
        </div>
      </div>

      <div class="checkout-section">
        <div class="checkout-section-title" style="margin-bottom:12px">Upload Payment</div>
        ${renderUploadArea()}
      </div>
    </div>
    <div class="checkout-submit">
      <button class="btn btn-primary" id="checkout-order-btn" onclick="confirmCheckoutEnhanced()"${count === 0 ? ' disabled style="opacity:0.5;pointer-events:none"' : ''}>Order</button>
    </div>
  </div>`;
}

function applyPromo() {
  const input = document.getElementById('promo-input');
  if (input && input.value.trim()) {
    showToast('Promo code is not valid', 'error');
  } else {
    showToast('Please enter a promo code', 'info');
  }
}

function renderLocation() {
  return `<div class="screen with-top-nav location-screen">
    ${renderTopNav('Select Location', { rightHTML: `<span class="nav-icon">${ICONS.search}</span>` })}
    <div class="location-search">
      <input type="text" placeholder="Search Address..." class="form-input" />
    </div>
    <div class="location-actions">
      <button onclick="showToast('Getting current location...','info')">${ICONS.location} Current Location</button>
      <button>${ICONS.map} Choose on Map</button>
    </div>
    ${renderMapPlaceholder()}
    <div class="location-saved">
      <h3>Recently Saved</h3>
      ${APP_DATA.savedAddresses.map(addr => `
        <div class="saved-address-item">
          ${ICONS.location}
          <div class="address-content">
            <div class="address-label">${addr.label}</div>
            <div class="address-text">${addr.address}</div>
            ${addr.phone ? `<div class="address-phone">${addr.phone}</div>` : ''}
          </div>
          <button class="edit-btn">${ICONS.edit}</button>
        </div>
      `).join('')}
    </div>
    <div class="location-submit">
      <a href="#checkout" class="btn btn-primary" onclick="showToast('Address saved','success')">Set Address</a>
    </div>
  </div>`;
}

function renderPaymentMethod() {
  return `<div class="screen with-top-nav payment-screen">
    ${renderTopNav('Select Payment Method')}
    <div class="payment-content">
      <div class="payment-logo">
        <span style="font-weight:800;letter-spacing:3px;font-size:22px;color:var(--primary-blue)">IPRS</span>
      </div>
      <div class="payment-options">
        ${renderRadioOption('Transfer Bank', appState.paymentMethod === 'transfer', 'payment')}
        ${renderRadioOption('Cash', appState.paymentMethod === 'cash', 'payment')}
      </div>
    </div>
    <div class="payment-submit">
      <a href="#checkout" class="btn btn-primary" onclick="appState.paymentMethod=document.querySelector('.radio-option.selected .radio-label')?.textContent?.toLowerCase().includes('transfer')?'transfer':'cash';showToast('Payment method updated','success')">Set Payment Method</a>
    </div>
  </div>`;
}

function renderOrderSuccess() {
  return `<div class="screen thankyou-screen">
    <div class="success-check">${ICONS.check}</div>
    <h1>Thank You for<br>Ordering!</h1>
    <p class="order-number">Order #BF-30231</p>
    <p class="thankyou-message">Your Order is being Processed</p>
    <p class="thankyou-desc">We will notify you when your order has been verified and going to your place.</p>
    <p class="delivery-info">📦 Estimated Delivery: 30-45 minutes</p>
    <p style="font-size:10px;color:var(--text-muted);margin-bottom:20px">Transaction ID: TXN-${Date.now().toString(36).toUpperCase()}</p>
    <a href="#order-detail" class="btn btn-primary" style="max-width:280px">Track Order</a>
    <a href="#home" class="btn-link btn-cancel-text">Return to Home</a>
  </div>`;
}
