// ============================================
// Screens Part 1: Welcome, Auth, Home (Enhanced)
// ============================================

function renderWelcome() {
  return `<div class="screen welcome-screen">
    <div class="welcome-hero">
      <div class="logo-text" style="font-size:28px">bio<span class="z">z</span>fresh</div>
      <div class="welcome-hero-content">
        <h1>The Essence<br><em>of Vitality.</em></h1>
        <p>Clean water isn't just a commodity, it's a fundamental human right. Biozfresh bridges the gap between scarcity and abundance through sustainable distribution.</p>
        <div class="welcome-hero-buttons">
          <a href="#login" class="btn btn-primary" style="flex:1">Get Started</a>
          <button class="btn btn-outline" style="flex:1">Our Mission</button>
        </div>
      </div>
      <div class="welcome-hero-image">
        <div style="width:100%;height:100%;background:linear-gradient(135deg,#1a5c3a 0%,#2d8a5e 50%,#1a7a4a 100%);display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.3);font-size:48px">🏞️</div>
      </div>
    </div>
    
    <div class="welcome-stat">
      <div class="stat-number">2.2B</div>
      <p class="stat-label">People still lack access to safely managed water services globally</p>
    </div>
    
    <div class="welcome-section">
      <h2>Clean Water &<br>Sanitation for <span>All</span></h2>
      <p>Sustainable Development Goals 6 goes beyond drinking water. It also encompasses sanitation, hygiene, and the health of our entire ecosystem.</p>
      
      <!-- Card 1 -->
      <div class="welcome-info-card">
        <h3>🛡️ Sumber Kehidupan</h3>
        <p>Air bersih adalah fondasi utama kesehatan and vitalitas. Menjaga kualitas air berarti menjaga denyut nadi kehidupan di seluruh ekosistem kita.</p>
      </div>
      
      <!-- Card 2 -->
      <div class="welcome-info-card green">
        <h3>💧 Manfaat Hidrasi</h3>
        <p>Hidrasi yang tepat meningkatkan energi, menjaga kesehatan kulit, dan memastikan seluruh fungsi tubuh berjalan optimal setiap hari.</p>
      </div>
      
      <!-- Card 3 -->
      <div class="welcome-info-card">
        <h3>👥 Akses untuk Warga</h3>
        <p>Misi kami adalah memberikan akses terhadap air bersih yang merata bagi warga di Guatemala dengan menerapkan sistem pemrosesan secara online.</p>
      </div>
    </div>
    
    <div class="welcome-cta">
      <h2>Ready to flow with us?</h2>
      <p>Start your journey towards conscious hydration. Pure water, delivered sustainably, impacting the world one drop at a time.</p>
      <a href="#login" class="btn btn-primary" style="width: 100%">Get Started Now</a>
    </div>
    
    <footer class="welcome-footer">
      <div class="logo-text">bio<span class="z">z</span>fresh</div>
      <p>Delivering global hydration standards through sustainable innovation and commitment to SDG 6.</p>
      <p style="font-weight: 700; margin-top: 10px;">Contact us</p>
      <p>WhatsApp +50224847083</p>
      <div style="font-size: 10px; opacity: 0.5; margin-top: 20px;">© 2024 Biozfresh. Delivering global hydration standards.</div>
    </footer>
  </div>`;
}

function renderPasswordField(label, name, placeholder) {
  return `<div class="form-group">
    <label class="form-label">${label}</label>
    <div class="password-wrapper">
      <input type="password" class="form-input" placeholder="${placeholder}" name="${name}" id="input-${name}" />
      <button type="button" class="password-toggle" onclick="togglePassword('input-${name}')">${ICONS.eyeOff || '👁'}</button>
    </div>
    <div class="form-error"></div>
  </div>`;
}

function renderRegister() {
  return `<div class="screen auth-screen">
    <div class="auth-bg" style="background:linear-gradient(180deg,#0a0a2e 0%,#1a1a4e 50%,#0d0d3d 100%)"></div>
    <div class="auth-logo">bio<span class="z" style="color:#7CDA24">z</span>fresh</div>
    <div class="auth-card">
      <h2>Register</h2>
      <p class="auth-subtitle">Create a new account</p>
      ${renderFormGroup('Name :', 'text', 'Enter your name', 'reg-name')}
      <div class="form-row">
        ${renderFormGroup('Username :', 'text', 'Enter username', 'reg-username')}
        ${renderFormGroup('Phone Number :', 'tel', 'Ex. 081..', 'reg-phone')}
      </div>
      ${renderFormGroup('E-Mail :', 'email', 'Enter your E-Mail', 'reg-email')}
      ${renderPasswordField('Password :', 'reg-password', 'Enter your password')}
      ${renderPasswordField('Password Confirmation :', 'reg-password2', 'Enter your password')}
      <button class="btn btn-primary" style="background:#6C3FC5;box-shadow:0 4px 12px rgba(108,63,197,0.3);margin-top:8px" id="register-btn" onclick="handleRegister()">REGISTER</button>
      <p class="auth-link">Have an account? <a href="#login">Login</a></p>
    </div>
  </div>`;
}

function handleRegister() {
  const v1 = validateField('input-reg-name', { required: true });
  const v2 = validateField('input-reg-email', { required: true, email: true });
  const v3 = validateField('input-reg-password', { required: true, minLength: 6 });
  if (v1 && v2 && v3) {
    setButtonLoading(document.getElementById('register-btn'), true);
    setTimeout(() => { showToast('Account created successfully!', 'success'); navigate('#login'); }, 1500);
  }
}

function renderLogin() {
  return `<div class="screen auth-screen">
    <div class="auth-bg" style="background:linear-gradient(180deg,#0a0a2e 0%,#1a1a4e 50%,#0d0d3d 100%)"></div>
    <div class="auth-logo">bio<span class="z" style="color:#7CDA24">z</span>fresh</div>
    <div class="auth-card">
      <h2>Welcome back!</h2>
      <p class="auth-subtitle">Login to Continue</p>
      <div class="auth-social-btns">
        <button class="btn btn-social" onclick="handleSocialLogin('Google')">
          <span class="btn-icon">${ICONS.google}</span>Login with Google
        </button>
        <button class="btn btn-social facebook" onclick="handleSocialLogin('Facebook')">
          <span class="btn-icon">${ICONS.facebook}</span>Login with Facebook
        </button>
      </div>
      <div class="divider-text">Or</div>
      ${renderFormGroup('Username / E-mail :', 'text', 'Enter your username or e-mail', 'login-user')}
      ${renderPasswordField('Password :', 'login-pass', 'Enter your password')}
      <div class="checkbox-group" onclick="this.querySelector('.checkbox-box').classList.toggle('checked')" style="margin-bottom:16px">
        <div class="checkbox-box"></div>
        <span class="checkbox-label">Remember me</span>
      </div>
      <button class="btn btn-primary" id="login-btn" onclick="handleLogin()">LOGIN</button>
      <p class="auth-forgot">Forgot your password? <a href="#" onclick="showForgotPassword();return false">Reset Password</a><br>Don't have an account? <a href="#register">Sign in here</a></p>
    </div>
  </div>`;
}

function handleLogin() {
  const v1 = validateField('input-login-user', { required: true });
  const v2 = validateField('input-login-pass', { required: true });
  if (v1 && v2) {
    setButtonLoading(document.getElementById('login-btn'), true);
    setTimeout(() => { showToast('Welcome back!', 'success'); navigate('#home'); }, 1200);
  }
}

function handleSocialLogin(provider) {
  showToast(`Connecting to ${provider}...`, 'info', 1200);
  setTimeout(() => { showToast('Login successful!', 'success'); navigate('#home'); }, 1500);
}

function showForgotPassword() {
  const content = `
    <div class="modal-title">Reset Password</div>
    <div class="modal-subtitle">Enter your email to receive a password reset link.</div>
    ${renderFormGroup('E-Mail :', 'email', 'Enter your email', 'forgot-email')}
    <div class="modal-actions">
      <button class="btn btn-secondary btn-sm" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary btn-sm" onclick="handleForgotPassword()">Send Link</button>
    </div>`;
  showModal(content, { center: true });
}

function handleForgotPassword() {
  if (validateField('input-forgot-email', { required: true, email: true })) {
    closeModal();
    showToast('Password reset link sent to your email', 'success');
  }
}

function renderHome() {
  const u = APP_DATA.user;
  const o = APP_DATA.currentOrder;
  const { count } = getCartTotal();
  const lastOrder = APP_DATA.orderHistory[0];
  const recommendedProducts = APP_DATA.products.filter(p => p.id === 5 || p.id === 6);
  
  return `<div class="screen with-bottom-nav home-screen">
    <div class="home-header">
      <div class="home-header-top">
        <span class="logo-text" style="color:#fff;font-size:18px">bio<span class="z" style="color:#7CDA24">z</span>fresh</span>
        ${renderAvatar(u.name, '', '#4CAF50')}
      </div>
      <div class="home-greeting">
        <h2>Hi, ${u.nickname}</h2>
        <p>Your hydration goals today<br>Stay Fresh!</p>
      </div>
      <div class="home-stats">
        <div class="home-stat-card">
          <div class="stat-icon">${ICONS.package}</div>
          <div>
            <div class="stat-value">${u.totalOrders}</div>
            <div class="stat-label">Jumlah Order</div>
          </div>
        </div>
        <div class="home-stat-card" style="flex-direction: column; align-items: flex-start; justify-content: space-between; padding: 12px 10px; min-height: 72px;">
          <div style="display: flex; align-items: center; gap: 8px; width: 100%;">
            <div class="stat-icon">${ICONS.droplet}</div>
            <div>
              <div class="stat-value" style="font-size:14px">${u.bonusGallon}/${u.bonusGallonMax}</div>
              <div class="stat-label">Bonus Gallon</div>
            </div>
          </div>
          <div style="width: 100%; height: 4px; background: rgba(255,255,255,0.25); border-radius: 9999px; overflow: hidden; margin-top: 6px;">
            <div style="width: ${(u.bonusGallon / u.bonusGallonMax) * 100}%; height: 100%; background: var(--accent-lime); border-radius: 9999px;"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="home-content">
      <div class="section-title">Current Order <span class="eta-badge">⏱ ETA 30 min</span></div>
      <div class="home-current-order" onclick="navigate('#order-detail')" style="cursor:pointer">
        <div class="order-status" style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
          <div style="display: flex; align-items: center; gap: 6px;">
            <div class="status-dot"></div>
            <span>${o.status}</span>
          </div>
          <span style="font-size: 9px; font-weight: 700; background: var(--accent-lime); color: var(--primary-blue-dark); padding: 2px 6px; border-radius: 4px;">PAID · ${o.paymentMethod}</span>
        </div>
        <div class="order-progress" style="margin-top: 8px;">
          <div class="order-progress-bar"><div class="order-progress-fill" style="width:65%"></div></div>
          <div class="order-progress-label"><span>Order Placed</span><span>On The Way</span><span>Delivered</span></div>
        </div>
        <div class="order-address">${ICONS.location}<span>Address: ${o.address}</span></div>
        <div class="courier-info" style="display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 8px;">
            ${renderAvatar(o.courier.name, 'sm', '#3B82F6')}
            <div class="courier-details">
              <h4>${o.courier.name}</h4>
              <p>${o.courier.phone}</p>
            </div>
          </div>
          <div style="display: flex; gap: 6px;">
            <button class="btn btn-xs" style="width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: rgba(43, 45, 130, 0.1); color: var(--primary-blue); padding: 0;" onclick="event.stopPropagation(); navigate('#messages')">${ICONS.chat}</button>
            <button class="btn btn-xs btn-success" style="width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; padding: 0;" onclick="event.stopPropagation(); window.location.href='tel:${o.courier.phone}'">${ICONS.phone}</button>
          </div>
        </div>
      </div>

      ${lastOrder ? `<div class="quick-reorder-card" onclick="quickReorder()">
        <div class="reorder-icon">🔄</div>
        <div class="reorder-info">
          <h4>Reorder Last Order</h4>
          <p>${lastOrder.items.map(i => i.name).join(', ')} · ${lastOrder.total}</p>
        </div>
        <button class="reorder-btn" onclick="event.stopPropagation();quickReorder()">Reorder</button>
      </div>` : ''}

      <div class="recommendation-card">
        <h3>💧 Stay Hydrated!</h3>
        <p>Get 10% off on your next 3-gallon order. Use code FRESH10 at checkout.</p>
        <button class="btn btn-sm" onclick="navigate('#orders')">Order Now →</button>
      </div>

      <div class="section-title">You might Interest</div>
      <div class="home-products">
        ${recommendedProducts.map(p => renderProductCard(p, appState.cart[p.id] || 0)).join('')}
      </div>
    </div>

    <!-- Floating About Us Support Button -->
    <button onclick="showAboutUsModal()" style="position: fixed; bottom: 80px; right: 20px; width: 44px; height: 44px; border-radius: 50%; background: var(--primary-blue); color: white; display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-md); border: none; cursor: pointer; z-index: 99;">
      <span style="font-size: 18px; font-weight: bold; font-family: var(--font-primary);">?</span>
    </button>

    <a href="#orders" class="home-add-order-badge">Add to 🛒${count > 0 ? ` (${count})` : ''}</a>
    ${renderBottomNav('home')}
  </div>`;
}

function showAboutUsModal() {
  const content = `
    <div style="text-align: center; padding: 8px 4px;">
      <div style="font-size: 40px; margin-bottom: 12px;">🌊</div>
      <h3 style="font-family: var(--font-primary); font-weight: 700; font-size: 18px; color: var(--primary-blue); margin-bottom: 8px;">About Biozfresh</h3>
      <p style="font-size: 12px; color: var(--text-secondary); line-height: 1.6; margin-bottom: 16px;">
        Biozfresh is a revolutionary clean water selling platform dedicated to solving water scarcity issues. Grounded in United Nations <strong>SDG 6: Clean Water and Sanitation</strong>, our mission is to deliver pure, high-quality drinking water directly and sustainably to citizens.
      </p>
      <p style="font-size: 11px; color: var(--primary-blue); font-weight: 700; margin-bottom: 20px;">
        Delivering global hydration standards.
      </p>
      <button class="btn btn-primary" onclick="closeModal()" style="padding: 10px 20px; background: var(--primary-blue); font-weight: 700; width: 100%;">Got it!</button>
    </div>
  `;
  showModal(content, { center: true });
}
