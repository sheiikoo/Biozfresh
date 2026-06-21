// ============================================
// Screens Part 3: My Orders, Order Detail, Feedback (Enhanced)
// ============================================

function renderMyOrders() {
  const o = APP_DATA.currentOrder;
  const hist = APP_DATA.orderHistory;
  const tab = appState.orderTab || 'active';
  return `<div class="screen with-top-nav with-bottom-nav myorders-screen">
    ${renderTopNav('', { showBack: false, rightHTML: renderAvatar(APP_DATA.user.name, 'sm', '#4CAF50') })}
    <div class="myorders-header" style="padding-top:12px">
      <div class="logo-text" style="font-size:20px;margin-bottom:8px">bio<span class="z">z</span>fresh</div>
      <h1>My Orders</h1>
    </div>
    <div style="padding:0 16px">
      <div class="tabs">
        <div class="tab${tab === 'active' ? ' active' : ''}" data-tab="active" onclick="setOrderTab('active')">Active</div>
        <div class="tab${tab === 'history' ? ' active' : ''}" data-tab="history" onclick="setOrderTab('history')">History</div>
      </div>
      <div class="order-filter-bar">
        <span class="order-filter-chip active" data-filter="all" onclick="setOrderFilter('all')">All</span>
        <span class="order-filter-chip" data-filter="pending" onclick="setOrderFilter('pending')">Pending</span>
        <span class="order-filter-chip" data-filter="delivered" onclick="setOrderFilter('delivered')">Delivered</span>
        <span class="order-filter-chip" data-filter="cancelled" onclick="setOrderFilter('cancelled')">Cancelled</span>
      </div>
    </div>
    <div class="myorders-content">
      <div id="orders-active" style="display:${tab === 'active' ? 'block' : 'none'}">
        <div class="myorders-section-title">Your Current Order</div>
        ${renderOrderStatusCard(o)}
      </div>
      <div id="orders-history" style="display:${tab === 'history' ? 'block' : 'none'}">
        <div class="myorders-section-title">Order History</div>
        ${hist.length > 0 ? hist.map(h => `
          <div class="order-history-item">
            <div class="order-header">
              ${renderAvatar(h.courier.name, 'sm', '#3B82F6')}
              <div class="order-meta">
                <h4>${h.courier.name}</h4>
                <p>${h.courier.phone}</p>
              </div>
            </div>
            <div class="order-details">
              <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px">📍 ${h.address}</div>
              <div class="order-row"><span>${h.date}</span><span>${h.total}</span></div>
            </div>
            <div style="display:flex;gap:8px">
              <button class="btn btn-primary btn-sm" onclick="navigate('#feedback')" style="background:var(--primary-blue);flex:1">Give Feedback</button>
              <button class="btn btn-secondary btn-sm" onclick="showToast('Reordering...','info');setTimeout(()=>{navigate('#checkout');showToast('Items added to cart','success')},1000)" style="flex:1">Reorder</button>
            </div>
          </div>
        `).join('') : '<div class="empty-state"><div style="font-size:40px;margin-bottom:10px">📋</div><p>No order history yet</p></div>'}
      </div>
    </div>
    ${renderBottomNav('myorders')}
  </div>`;
}

function renderMyOrdersEmpty() {
  return `<div class="screen with-top-nav with-bottom-nav myorders-screen">
    ${renderTopNav('', { showBack: false, rightHTML: renderAvatar(APP_DATA.user.name, 'sm', '#4CAF50') })}
    <div class="myorders-header" style="padding-top:12px">
      <div class="logo-text" style="font-size:20px;margin-bottom:8px">bio<span class="z">z</span>fresh</div>
      <h1>My Orders</h1>
    </div>
    <div class="empty-state" style="padding-top:60px">
      <div style="font-size:48px;margin-bottom:14px">📦</div>
      <h3 style="font-size:15px;font-weight:600;margin-bottom:4px">No orders yet</h3>
      <p>Your orders will appear here once you place your first order.</p>
      <a href="#orders" class="btn btn-primary btn-sm" style="max-width:180px;margin-top:16px">Order Now</a>
    </div>
    ${renderBottomNav('myorders')}
  </div>`;
}

function renderOrderDetail() {
  const o = APP_DATA.currentOrder;
  const status = appState.deliveryStatus || 'on-the-way';
  const isDelivered = status === 'delivered';
  return `<div class="screen with-top-nav order-detail-screen">
    ${renderTopNav('Your Order')}
    <div class="order-detail-map">${renderMapPlaceholder()}</div>
    <div class="order-detail-info">
      ${isDelivered ? `<div class="delivery-completed">
        <div class="completed-icon">${ICONS.check}</div>
        <h3>Delivered Successfully!</h3>
        <p>Your order has been delivered. Enjoy your fresh water!</p>
      </div>` : ''}
      <div class="order-detail-courier">
        ${renderAvatar(o.courier.name, '', '#3B82F6')}
        <div class="courier-details">
          <h4>${o.courier.name}</h4>
          <p>${o.courier.phone}</p>
        </div>
        <button class="btn btn-sm btn-success" style="width:auto;padding:5px 10px;font-size:10px" onclick="window.location.href='tel:+6281234567890'">📞 Call</button>
      </div>
      <div class="order-detail-address">
        ${ICONS.location}
        <span>Jl. Mawar No. 50, Malang</span>
      </div>
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px;font-size:13px">
        <span>💰 Rp. 50.000,00</span>
        <span style="padding:4px 10px;background:var(--bg-light);border-radius:20px;font-size:11px">Cash</span>
        <span class="eta-badge" style="margin-left:auto">⏱ ETA ${isDelivered ? 'Arrived' : '25 min'}</span>
      </div>

      <div style="margin-bottom:16px">
        <h3 style="font-size:13px;font-weight:600;margin-bottom:10px">Delivery Progress</h3>
        ${renderOrderTimeline(status)}
        ${!isDelivered ? `<div style="display:flex;gap:6px;margin-top:10px">
          <button class="btn btn-xs btn-secondary" style="flex:1" onclick="toggleDeliveryStatus('confirmed')">Confirmed</button>
          <button class="btn btn-xs btn-primary" style="flex:1" onclick="toggleDeliveryStatus('on-the-way')">On Way</button>
          <button class="btn btn-xs btn-success" style="flex:1" onclick="toggleDeliveryStatus('delivered')">Delivered</button>
        </div>` : ''}
      </div>

      <div class="order-detail-transaction">
        <h3>Rincian Transaksi</h3>
        <div class="transaction-row"><span>Club Refill (5 Gallons)</span><span>Rp. 50.000</span></div>
        <div class="transaction-row"><span>Distance (3 km)</span><span>Rp. 3.000</span></div>
        <div class="transaction-row total"><span>Total</span><span>Rp. 53.000</span></div>
      </div>
      ${isDelivered ? `<a href="#feedback" class="btn btn-primary" style="margin-top:12px">Give Feedback</a>` :
        `<button class="btn btn-danger" style="margin-top:12px" onclick="confirmCancelOrder()">Cancel Order</button>`}
    </div>
    ${!isDelivered ? `<button class="courier-fab" onclick="window.location.href='tel:+6281234567890'">${ICONS.phone}</button>` : ''}
  </div>`;
}


function renderFeedback() {
  const ratingTexts = ['', 'Terrible experience', 'Bad experience', 'Okay experience', 'Fantastic service, highly recommend!', 'Outstanding service!'];
  return `<div class="screen with-top-nav feedback-screen">
    ${renderTopNav('Rate Your Experience')}
    <div class="feedback-content">
      <div class="feedback-order-info">
        <div style="width:32px;height:32px;background:var(--primary-blue);border-radius:8px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:14px;flex-shrink:0">📦</div>
        <div>
          <div class="order-id">Order #BF-30231</div>
          <div class="order-desc">Delivered by Kevin De Bruyne</div>
        </div>
      </div>
      <div class="feedback-question">How was our service?</div>
      ${renderStarRating(appState.rating)}
      <p class="feedback-response">${ratingTexts[appState.rating] || ''}</p>
      <div class="feedback-tags">
        <h3>What do you like about our services?</h3>
        <div class="chip-group">
          ${APP_DATA.feedbackTags.map(tag => `<span class="chip${appState.selectedTags.includes(tag) ? ' selected' : ''}" onclick="toggleTag('${tag}')">${tag}</span>`).join('')}
        </div>
      </div>
      <div class="feedback-text">
        <h3>Tell us more (Optional)</h3>
        <textarea class="form-input" placeholder="Describe your experience with Biozfresh..." maxlength="500" id="feedback-textarea" oninput="updateCharCount()"></textarea>
        <div class="char-count"><span id="char-count">0</span>/500</div>
      </div>
      <div class="feedback-upload" style="margin-bottom:14px">
        <button class="feedback-upload-btn" onclick="handleFeedbackImageUpload()">${ICONS.camera} Attach Photo</button>
        <div class="feedback-upload-preview" style="display:none;position:relative"></div>
      </div>
    </div>
    <div class="feedback-submit" style="padding:16px 20px">
      <button class="btn btn-primary" id="feedback-btn" onclick="handleFeedbackSubmit()">Send Feedback</button>
    </div>
  </div>`;
}

function handleFeedbackSubmit() {
  if (appState.rating === 0) { showToast('Please select a rating', 'error'); return; }
  setButtonLoading(document.getElementById('feedback-btn'), true);
  setTimeout(() => { navigate('#feedback-sent'); }, 1200);
}

function toggleTag(tag) {
  const idx = appState.selectedTags.indexOf(tag);
  if (idx > -1) appState.selectedTags.splice(idx, 1);
  else appState.selectedTags.push(tag);
  renderCurrentScreen();
}

function updateCharCount() {
  const ta = document.getElementById('feedback-textarea');
  const cc = document.getElementById('char-count');
  if (ta && cc) cc.textContent = ta.value.length;
}

function renderFeedbackSent() {
  return `<div class="screen with-top-nav feedback-screen">
    ${renderTopNav('Rate Your Experience')}
    <div class="feedback-content" style="padding-top:40px">
      <div class="feedback-sent">
        <div class="success-check">${ICONS.check}</div>
        <h2>Feedback Sent!</h2>
        <p>Thank you for helping us grow</p>
        <div class="chip-group" style="justify-content:center;margin:16px 0">
          ${appState.selectedTags.map(t => `<span class="chip selected">${t}</span>`).join('')}
        </div>
        <a href="#home" class="btn btn-primary btn-sm" style="max-width:200px;margin:16px auto 0">Back to Home</a>
      </div>
    </div>
  </div>`;
}
