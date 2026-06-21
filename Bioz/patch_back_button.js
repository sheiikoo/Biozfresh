const fs = require('fs');
const path = require('path');
const vm = require('vm');

const targetFilePath = path.join(__dirname, '..', 'biozfresh.html');
let content = fs.readFileSync(targetFilePath, 'utf8');

console.log('Original biozfresh.html loaded safely. Length:', content.length);

// Robust function replacement helper
function replaceFunction(name, newCode) {
  const startIndex = content.indexOf(`function ${name}`);
  if (startIndex === -1) {
    console.error(`Could not find function ${name} to replace!`);
    return false;
  }
  
  // Find the opening brace of the body (after the signature's closing paren)
  const signatureEnd = content.indexOf(')', startIndex + `function ${name}`.length);
  if (signatureEnd === -1) {
    console.error(`Could not find signature end for ${name}`);
    return false;
  }
  
  const bodyStartIndex = content.indexOf('{', signatureEnd);
  if (bodyStartIndex === -1) {
    console.error(`Could not find body start for ${name}`);
    return false;
  }
  
  let braceCount = 1;
  let inString = false;
  let stringChar = '';
  let i = bodyStartIndex + 1;
  while (i < content.length) {
    const char = content[i];
    if ((char === '"' || char === "'" || char === '`') && content[i-1] !== '\\') {
      if (!inString) { inString = true; stringChar = char; }
      else if (stringChar === char) { inString = false; }
    }
    if (!inString) {
      if (char === '{') { braceCount++; }
      else if (char === '}') {
        braceCount--;
        if (braceCount === 0) {
          const end = i + 1;
          content = content.slice(0, startIndex) + newCode + content.slice(end);
          console.log(`Successfully replaced function ${name}`);
          return true;
        }
      }
    }
    i++;
  }
  console.error(`Failed to parse braces for function ${name}`);
  return false;
}

// 1. Upgrade renderTopNav to support showing BOTH the back button and leftHTML (logo) side-by-side
const newRenderTopNav = `function renderTopNav(title, opts = {}) {
  const { showBack = true, rightHTML = '', leftHTML = '', dark = false, transparent = false } = opts;
  const cls = \`top-nav\${dark ? ' dark' : ''}\${transparent ? ' transparent' : ''}\`;
  return \`<nav class="\${cls}">
    \${showBack ? \`<div style="display:flex;align-items:center;gap:4px"><button class="top-nav-back" onclick="goBack()">\${ICONS.back}</button>\dots\${leftHTML}</div>\` : leftHTML ? \`<div class="top-nav-left" style="display:flex;align-items:center">\${leftHTML}</div>\` : '<div style="width:36px"></div>'}
    <span class="top-nav-title"\${dark ? ' style="color:#fff"' : ''}>\${title}</span>
    <div class="top-nav-right">\${rightHTML}</div>
  </nav>\`;
}`;

// Wait! In the newRenderTopNav template literal string above, there is a minor truncation "\dots\${leftHTML}". Let's fix that to be exactly: "\${leftHTML}".
// Let's rewrite it cleanly:
const fixedRenderTopNav = `function renderTopNav(title, opts = {}) {
  const { showBack = true, rightHTML = '', leftHTML = '', dark = false, transparent = false } = opts;
  const cls = \`top-nav\${dark ? ' dark' : ''}\${transparent ? ' transparent' : ''}\`;
  return \`<nav class="\${cls}">
    \${showBack ? \`<div style="display:flex;align-items:center;gap:4px"><button class="top-nav-back" onclick="goBack()">\${ICONS.back}</button>\${leftHTML}</div>\` : leftHTML ? \`<div class="top-nav-left" style="display:flex;align-items:center">\${leftHTML}</div>\` : '<div style="width:36px"></div>'}
    <span class="top-nav-title"\${dark ? ' style="color:#fff"' : ''}>\${title}</span>
    <div class="top-nav-right">\${rightHTML}</div>
  </nav>\`;
}`;

replaceFunction('renderTopNav', fixedRenderTopNav);

// 2. Upgrade renderOrders to set showBack: true
const newRenderOrders = `function renderOrders() {
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

  return \`<div class="screen with-top-nav orders-screen" style="padding-bottom:\dots">
    \${renderTopNav('', { 
      showBack: true, 
      leftHTML: \`<div class="logo-text" style="font-size:18px;font-weight:700">bio<span class="z">z</span>fresh</div>\`,
      rightHTML: renderAvatar(APP_DATA.user.name, 'sm', '#4CAF50')
    })}
    <div class="orders-header" style="padding-top:12px; margin-bottom: 12px;">
      <h1>Choose your<br>Freshness</h1>
    </div>

    <!-- Filter & Sort Section -->
    <div class="filter-sort-section" style="padding: 0 16px 12px; display: flex; flex-direction: column; gap: 8px;">
      <div style="display: flex; flex-direction: column; gap: 4px;">
        <span style="font-size: 10px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px;">Filter Kategori</span>
        <div class="filter-pills" style="display: flex; gap: 6px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: none;">
          \${[
            { key: 'all', label: 'Semua' },
            { key: 'refill', label: 'Air Isi Ulang' },
            { key: 'new', label: 'Galon Baru' },
            { key: 'promo', label: 'Promo' }
          ].map(f => {
            const active = currentFilter === f.key;
            return \`<button onclick="setProductFilter('\${f.key}')" style="padding: 6px 12px; border-radius: 9999px; font-size: 11px; font-weight: 600; white-space: nowrap; border: 1.5px solid \${active ? 'var(--primary-blue)' : 'var(--border-color)'}; background: \${active ? 'var(--primary-blue)' : 'var(--white)'}; color: \${active ? 'var(--white)' : 'var(--text-secondary)'}; transition: all 0.2s ease;">\${f.label}</button>\`;
          }).join('')}
        </div>
      </div>

      <div style="display: flex; flex-direction: column; gap: 4px; margin-top: 4px;">
        <span style="font-size: 10px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px;">Urutkan Harga</span>
        <div class="sort-pills" style="display: flex; gap: 6px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: none;">
          \${[
            { key: 'low', label: 'Harga Terendah' },
            { key: 'high', label: 'Harga Tertinggi' },
            { key: 'popular', label: 'Terpopuler' }
          ].map(s => {
            const active = currentSort === s.key;
            return \`<button onclick="setProductSort('\${s.key}')" style="padding: 6px 12px; border-radius: 9999px; font-size: 11px; font-weight: 600; white-space: nowrap; border: 1.5px solid \${active ? 'var(--primary-blue)' : 'var(--border-color)'}; background: \${active ? 'var(--primary-blue)' : 'var(--white)'}; color: \${active ? 'var(--white)' : 'var(--text-secondary)'}; transition: all 0.2s ease;">\${s.label}</button>\`;
          }).join('')}
        </div>
      </div>
    </div>

    <div class="orders-grid">
      \${filtered.map(p => {
        const fav = (appState.favorites || []).includes(p.id);
        const svg = createProductSVG(p.name, p.color);
        const imgSrc = \`data:image/svg+xml,\${encodeURIComponent(svg)}\`;
        const qty = appState.cart[p.id] || 0;
        const oos = p.outOfStock;
        return \`<div class="product-card\${oos ? ' out-of-stock' : ''}" data-id="\${p.id}" onclick="\${oos ? 'showToast(\\'Out of stock\\',\\'error\\')' : 'showProductDetail(' + p.id + ')'}" style="position: relative;">
          \${qty > 0 ? \`<div style="position: absolute; top: 8px; right: 8px; background: var(--primary-blue); color: white; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; z-index: 10;">\${qty}</div>\` : ''}
          <div class="favorite-btn\${fav ? ' active' : ''}" onclick="event.stopPropagation();toggleFavorite(\${p.id})">
            \${fav ? (ICONS.heartFilled || '♥') : (ICONS.heart || '♡')}
          </div>
          <img src="\${imgSrc}" alt="\${p.name}" class="product-card-image"/>
          <div class="product-card-name">\${p.name}</div>
          <div class="product-card-price">
            <span>\${p.priceLabel}</span>
            \${oos ? '<span style="font-size:9px;color:var(--error);font-weight:600">Habis</span>' : qty > 0 ? \`
              <div class="product-qty-controls" onclick="event.stopPropagation()">
                <button class="product-qty-btn minus" onclick="updateQty(\dots)">−</button>
                <span class="product-qty-value">\${qty}</span>
                <button class="product-qty-btn plus" onclick="updateQty(\dots)">+</button>
              </div>\` : \`
              <button class="product-add-btn" onclick="event.stopPropagation();updateQty(\${p.id},1);showToast('Added to cart','success',1200)">+</button>\`}
          </div>
        </div>\`;
      }).join('')}
    </div>
    \${count > 0 ? \`<div class="orders-bottom-bar">
      <div class="order-summary">My Order<br><strong>Rp \${total.toLocaleString('id-ID')}</strong> · Total Gallon: \${count}</div>
      <a href="#checkout" class="btn btn-primary btn-sm" style="width:auto">Checkout</a>
    </div>\` : ''}
    \${count > 0 ? \`<div class="order-counter-badge">\${count}</div>\` : ''}
  </div>\`;
}`;

// Wait! In the newRenderOrders template literal string above, there is still some \dots placeholders like "updateQty(\dots)". Let's write them cleanly: "updateQty(\${p.id},-1)" and "updateQty(\${p.id},1)", and style-bottom: "\${count > 0 ? '80px' : '0'}".
// Let's rewrite this part perfectly to be 100% exact!
const fixedRenderOrders = \`function renderOrders() {
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

  return \\\`<div class="screen with-top-nav orders-screen" style="padding-bottom:\\\${count > 0 ? '80px' : '0'}">
    \\\${renderTopNav('', { 
      showBack: true, 
      leftHTML: \\\`<div class="logo-text" style="font-size:18px;font-weight:700">bio<span class="z">z</span>fresh</div>\\\`,
      rightHTML: renderAvatar(APP_DATA.user.name, 'sm', '#4CAF50')
    })}
    <div class="orders-header" style="padding-top:12px; margin-bottom: 12px;">
      <h1>Choose your<br>Freshness</h1>
    </div>

    <!-- Filter & Sort Section -->
    <div class="filter-sort-section" style="padding: 0 16px 12px; display: flex; flex-direction: column; gap: 8px;">
      <div style="display: flex; flex-direction: column; gap: 4px;">
        <span style="font-size: 10px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px;">Filter Kategori</span>
        <div class="filter-pills" style="display: flex; gap: 6px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: none;">
          \\\${[
            { key: 'all', label: 'Semua' },
            { key: 'refill', label: 'Air Isi Ulang' },
            { key: 'new', label: 'Galon Baru' },
            { key: 'promo', label: 'Promo' }
          ].map(f => {
            const active = currentFilter === f.key;
            return \\\`<button onclick="setProductFilter('\\\\\\\${f.key}')" style="padding: 6px 12px; border-radius: 9999px; font-size: 11px; font-weight: 600; white-space: nowrap; border: 1.5px solid \\\${active ? 'var(--primary-blue)' : 'var(--border-color)'}; background: \\\${active ? 'var(--primary-blue)' : 'var(--white)'}; color: \\\${active ? 'var(--white)' : 'var(--text-secondary)'}; transition: all 0.2s ease;">\\\\\\\${f.label}</button>\\\`;
          }).join('')}
        </div>
      </div>

      <div style="display: flex; flex-direction: column; gap: 4px; margin-top: 4px;">
        <span style="font-size: 10px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px;">Urutkan Harga</span>
        <div class="sort-pills" style="display: flex; gap: 6px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: none;">
          \\\${[
            { key: 'low', label: 'Harga Terendah' },
            { key: 'high', label: 'Harga Tertinggi' },
            { key: 'popular', label: 'Terpopuler' }
          ].map(s => {
            const active = currentSort === s.key;
            return \\\`<button onclick="setProductSort('\\\\\\\${s.key}')" style="padding: 6px 12px; border-radius: 9999px; font-size: 11px; font-weight: 600; white-space: nowrap; border: 1.5px solid \\\${active ? 'var(--primary-blue)' : 'var(--border-color)'}; background: \\\${active ? 'var(--primary-blue)' : 'var(--white)'}; color: \\\${active ? 'var(--white)' : 'var(--text-secondary)'}; transition: all 0.2s ease;">\\\\\\\${s.label}</button>\\\`;
          }).join('')}
        </div>
      </div>
    </div>

    <div class="orders-grid">
      \\\${filtered.map(p => {
        const fav = (appState.favorites || []).includes(p.id);
        const svg = createProductSVG(p.name, p.color);
        const imgSrc = \\\`data:image/svg+xml,\\\${encodeURIComponent(svg)}\\\`;
        const qty = appState.cart[p.id] || 0;
        const oos = p.outOfStock;
        return \\\`<div class="product-card\\\${oos ? ' out-of-stock' : ''}" data-id="\\\${p.id}" onclick="\\\${oos ? 'showToast(\\\\'Out of stock\\\\',\\\\'error\\\\')' : 'showProductDetail(' + p.id + ')'}" style="position: relative;">
          \\\${qty > 0 ? \\\`<div style="position: absolute; top: 8px; right: 8px; background: var(--primary-blue); color: white; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; z-index: 10;">\\\${qty}</div>\\\` : ''}
          <div class="favorite-btn\\\${fav ? ' active' : ''}" onclick="event.stopPropagation();toggleFavorite(\\\${p.id})">
            \\\${fav ? (ICONS.heartFilled || '♥') : (ICONS.heart || '♡')}
          </div>
          <img src="\\\${imgSrc}" alt="\\\${p.name}" class="product-card-image"/>
          <div class="product-card-name">\\\${p.name}</div>
          <div class="product-card-price">
            <span>\\\${p.priceLabel}</span>
            \\\${oos ? '<span style="font-size:9px;color:var(--error);font-weight:600">Habis</span>' : qty > 0 ? \\\`
              <div class="product-qty-controls" onclick="event.stopPropagation()">
                <button class="product-qty-btn minus" onclick="updateQty(\\\${p.id},-1)">−</button>
                <span class="product-qty-value">\\\${qty}</span>
                <button class="product-qty-btn plus" onclick="updateQty(\\\${p.id},1)">+</button>
              </div>\\\` : \\\`
              <button class="product-add-btn" onclick="event.stopPropagation();updateQty(\\\${p.id},1);showToast('Added to cart','success',1200)">+</button>\\\`}
          </div>
        </div>\\\`;
      }).join('')}
    </div>
    \\\${count > 0 ? \\\`<div class="orders-bottom-bar">
      <div class="order-summary">My Order<br><strong>Rp \\\${total.toLocaleString('id-ID')}</strong> · Total Gallon: \\\${count}</div>
      <a href="#checkout" class="btn btn-primary btn-sm" style="width:auto">Checkout</a>
    </div>\\\` : ''}
    \\\${count > 0 ? \\\`<div class="order-counter-badge">\\\${count}</div>\\\` : ''}
  </div>\\\`;
}\`;

replaceFunction('renderOrders', fixedRenderOrders);

// 3. Sandbox validation
const codeStart = content.indexOf('<script>');
const codeEnd = content.lastIndexOf('</script>');
const codeToValidate = content.slice(codeStart + 8, codeEnd);

const dom = { innerHTML: '', scrollTo: () => {}, appendChild: () => {}, querySelector: () => null, querySelectorAll: () => [] };
const documentMock = { getElementById: () => dom, querySelector: () => null, querySelectorAll: () => [], createElement: () => ({ className: '', innerHTML: '', appendChild: () => {} }), addEventListener: () => {} };
const windowMock = { location: { hash: '' }, addEventListener: () => {}, scrollTo: () => {}, navigator: { userAgent: 'mock' } };

const sandbox = {
  window: windowMock,
  document: documentMock,
  navigator: windowMock.navigator,
  console: console,
  setTimeout: setTimeout,
  setInterval: setInterval,
  clearTimeout: clearTimeout,
  clearInterval: clearInterval,
  Image: function() {},
  FileReader: function() {},
};
sandbox.window.routes = {};

console.log('Validating payment flow enhancements in sandbox...');
try {
  vm.runInContext(codeToValidate, vm.createContext(sandbox));
  console.log('VALIDATION SUCCESSFUL! The script executed fully without throwing any runtime errors!');

  // 4. Write back to files
  const target1 = path.join(__dirname, '..', 'biozfresh.html');
  const target2 = path.join(__dirname, 'index.html');

  fs.writeFileSync(target1, content, 'utf8');
  console.log(\`Successfully wrote to biozfresh.html\`);

  fs.writeFileSync(target2, content, 'utf8');
  console.log(\`Successfully wrote to index.html\`);
} catch (e) {
  console.error('CRITICAL VALIDATION ERROR: Compilation failure:');
  console.error(e.stack || e.message);
  process.exit(1);
}
