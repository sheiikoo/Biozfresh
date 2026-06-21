// ============================================
// Screens Part 4: Chat, Profile, Edit Profile (Enhanced)
// ============================================

function renderMessages() {
  return `<div class="screen with-top-nav with-bottom-nav chat-screen">
    ${renderTopNav('', { showBack: false, rightHTML: renderAvatar(APP_DATA.user.name, 'sm', '#4CAF50') })}
    <div class="chat-header-bar" style="padding-top:12px">
      <div class="logo-text" style="font-size:20px;margin-bottom:12px">bio<span class="z">z</span>fresh</div>
      <h1>Messages</h1>
      <div class="chat-search">
        ${ICONS.search}
        <input type="text" placeholder="Search..." oninput="filterChats(this.value)" />
      </div>
    </div>
    <div class="chat-list" id="chat-list">
      ${APP_DATA.chatContacts.length > 0 ? APP_DATA.chatContacts.map(c => {
        const isOnline = c.id <= 2;
        return `<div class="chat-list-item" data-name="${c.name.toLowerCase()}" onclick="appState.currentChat=${c.id};navigate('#chat')">
          <div style="position:relative">
            ${renderAvatar(c.name, '', c.color)}
            <div class="online-status ${isOnline ? 'online' : 'offline'}"></div>
          </div>
          <div class="chat-list-content">
            <div class="chat-list-name">${c.name}</div>
            <div class="chat-list-message">${c.lastMessage}</div>
          </div>
          <div class="chat-list-meta">
            <span class="chat-list-time">${c.time}</span>
            ${c.unread > 0 ? `<span class="badge badge-red">${c.unread}</span>` : ''}
          </div>
        </div>`;
      }).join('') : `<div class="empty-chat">
        <div class="empty-icon">💬</div>
        <h3>No messages yet</h3>
        <p>Start a conversation with your courier or support team.</p>
      </div>`}
    </div>
    ${renderBottomNav('chat')}
  </div>`;
}

function filterChats(query) {
  const items = document.querySelectorAll('.chat-list-item');
  items.forEach(item => {
    const name = item.dataset.name || '';
    item.style.display = name.includes(query.toLowerCase()) ? 'flex' : 'none';
  });
}

function renderChat() {
  const chatId = appState.currentChat;
  const chatData = APP_DATA.chatMessages[chatId];
  if (!chatData) return renderMessages();
  
  const contact = APP_DATA.chatContacts.find(c => c.id === chatId);
  const isOnline = chatId <= 2;
  let messagesHTML = '';
  let lastDate = '';

  chatData.messages.forEach(msg => {
    if (msg.date !== lastDate) {
      lastDate = msg.date;
      messagesHTML += `<div class="conversation-date">${msg.date}</div>`;
    }
    const statusIcon = msg.sent ? `<span class="msg-status ${msg.read !== false ? 'read' : 'sent'}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></span>` : '';
    messagesHTML += `<div class="chat-bubble ${msg.sent ? 'sent' : 'received'}">
      ${msg.text ? `<div>${msg.text}</div>` : ''}
      <div class="chat-bubble-time">${msg.time} ${statusIcon}</div>
    </div>`;
  });

  return `<div class="screen with-top-nav conversation-screen" style="padding-bottom:65px">
    <nav class="top-nav">
      <button class="top-nav-back" onclick="navigate('#messages')">${ICONS.back}</button>
      <div class="conversation-header">
        <div style="position:relative">
          ${renderAvatar(chatData.name, 'sm', contact?.color || '#2196F3')}
          <div class="online-status ${isOnline ? 'online' : 'offline'}"></div>
        </div>
        <div>
          <h3>${chatData.name}</h3>
          <span style="font-size:9px;color:${isOnline ? '#16a34a' : 'var(--text-muted)'}">${isOnline ? 'Online' : 'Last seen 2h ago'}</span>
        </div>
      </div>
      <span class="nav-icon">${ICONS.phone}</span>
    </nav>
    <div class="conversation-messages" id="chat-messages">${messagesHTML}</div>
    <div class="conversation-input">
      <div class="input-actions">
        <button onclick="showToast('Emoji picker coming soon','info')">${ICONS.emoji}</button>
        <button onclick="handleChatImageSelect()">${ICONS.camera}</button>
      </div>
      <input type="text" placeholder="Type a message..." id="chat-input" onkeydown="if(event.key==='Enter')sendMessage()" />
      <button class="send-btn" onclick="sendMessage()">${ICONS.send}</button>
    </div>
  </div>`;
}

function renderProfile() {
  const u = APP_DATA.user;
  return `<div class="screen with-top-nav with-bottom-nav profile-screen">
    ${renderTopNav('', { showBack: false, rightHTML: '' })}
    <div class="profile-header" style="padding-top:12px">
      <div class="logo-text" style="font-size:20px;margin-bottom:12px;text-align:left">bio<span class="z">z</span>fresh</div>
      <h1>My Profile</h1>
      <div class="profile-info">
        ${renderAvatar(u.name, 'xl', '#4CAF50')}
        <h3>${u.name}</h3>
        <div class="profile-detail">${ICONS.phone}<span>${u.phone}</span></div>
        <div class="profile-detail">${ICONS.mail}<span>${u.email}</span></div>
        <div class="profile-detail">${ICONS.location}<span>${u.officeAddress}</span></div>
      </div>
    </div>

    <div class="profile-sections">
      <div class="profile-section">
        <h3>Account settings</h3>
        ${renderSettingItem(ICONS.edit, 'Edit Profile', { onClick: "navigate('#edit-profile')" })}
        ${renderSettingItem(ICONS.lock, 'Change Password', { onClick: "showChangePassword()" })}
        ${renderSettingItem(ICONS.bell, 'Notification Preferences', { onClick: "showNotificationPrefs()" })}
        ${renderSettingItem(ICONS.shield, 'Account Security', { onClick: "showAccountSecurity()" })}
      </div>
      <div class="profile-section">
        <h3>App Settings</h3>
        ${renderSettingItem(ICONS.bell, 'Push Notifications', { toggle: true, toggleActive: true })}
        ${renderSettingItem(ICONS.shield, 'Two-Factor Auth', { toggle: true, toggleActive: false })}
      </div>
      <div class="profile-section">
        <h3>Support and Legal</h3>
        ${renderSettingItem(ICONS.help, 'Help Centre')}
        ${renderSettingItem(ICONS.shield, 'Privacy Policy')}
        ${renderSettingItem(ICONS.file, 'Terms of Service')}
      </div>
      <div class="profile-logout" onclick="confirmLogout()">
        ${ICONS.logout}<span>Logout</span>
      </div>
    </div>
    ${renderBottomNav('profile')}
  </div>`;
}

function showChangePassword() {
  const content = `
    <div class="modal-title">Change Password</div>
    <div class="modal-subtitle">Enter your current and new password</div>
    ${renderPasswordField('Current Password :', 'cp-current', 'Enter current password')}
    ${renderPasswordField('New Password :', 'cp-new', 'Enter new password')}
    ${renderPasswordField('Confirm Password :', 'cp-confirm', 'Confirm new password')}
    <div class="modal-actions">
      <button class="btn btn-secondary btn-sm" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary btn-sm" onclick="handleChangePassword()">Save</button>
    </div>`;
  showModal(content);
}

function handleChangePassword() {
  const v1 = validateField('input-cp-current', { required: true });
  const v2 = validateField('input-cp-new', { required: true, minLength: 6 });
  if (v1 && v2) {
    closeModal();
    showToast('Password updated successfully', 'success');
  }
}

function renderEditProfile() {
  const u = APP_DATA.user;
  return `<div class="screen with-top-nav edit-profile-screen">
    ${renderTopNav('Edit Profile')}
    <div class="edit-profile-content">
      <div class="edit-profile-avatar">
        <div class="profile-pic-upload">
          ${appState.profilePic ? `<img src="${appState.profilePic}" class="avatar avatar-2xl" style="border:3px solid var(--primary-blue)" alt="Profile"/>` : renderAvatar(u.name, '2xl', '#4CAF50')}
          <div class="camera-overlay" onclick="handleProfilePicUpload()">${ICONS.camera}</div>
        </div>
        <button onclick="handleProfilePicUpload()" style="color:var(--primary-blue);font-weight:500;font-size:13px;background:none;border:none">Change Profile Picture</button>
      </div>
      <div class="edit-profile-form">
        ${renderFormGroup('Full Name', 'text', '', 'ep-name', u.name)}
        ${renderFormGroup('Username', 'text', '', 'ep-username', u.username)}
        ${renderFormGroup('Telephone Number', 'tel', '', 'ep-phone', '+6281 2345 6789')}
        ${renderFormGroup('Address', 'text', '', 'ep-address', u.address)}
      </div>
    </div>
    <div class="edit-profile-submit" style="padding:16px 20px">
      <button class="btn btn-primary" id="save-profile-btn" onclick="handleSaveProfile()">Save Changes</button>
      <a href="#profile" class="btn-cancel-text">Cancel</a>
    </div>
  </div>`;
}

function handleSaveProfile() {
  const v1 = validateField('input-ep-name', { required: true });
  if (v1) {
    setButtonLoading(document.getElementById('save-profile-btn'), true);
    setTimeout(() => { navigate('#edit-profile-success'); }, 1200);
  }
}

function renderEditProfileSuccess() {
  return `<div class="success-overlay" onclick="navigate('#profile')">
    <div class="success-check">${ICONS.check}</div>
    <h2>Successfully Saved<br>Changes!</h2>
    <p>Click anywhere to continue...</p>
  </div>`;
}
