(() => {
  let currentUser = null;
  let conversations = [];
  let activePartner = null;
  let activeMessages = [];
  let pollTimer = null;
  let isSending = false;
  let searchDebounceTimer = null;
  let isPreviewMode = false;

  // Mock data for local file preview (when opened directly via file://)
  const mockUsers = [
    {
      id: 101,
      username: 'sarah_c',
      display_name: 'Sarah Connor',
      profile_photo_url: null,
      bio: 'Community builder & photographer. Coffee lover.',
    },
    {
      id: 102,
      username: 'alex_dev',
      display_name: 'Alex Rivera',
      profile_photo_url: null,
      bio: 'Full-stack engineer working on SocialClub features.',
    },
    {
      id: 103,
      username: 'marcus',
      display_name: 'Marcus Vance',
      profile_photo_url: null,
      bio: 'Product designer & creative technologist.',
    },
    {
      id: 104,
      username: 'emily_design',
      display_name: 'Emily Chen',
      profile_photo_url: null,
      bio: 'Design systems & typography enthusiast.',
    },
  ];

  const mockConversations = [
    {
      user: mockUsers[0],
      last_message: {
        id: 1,
        content: 'Hey! Have you seen the new direct messages feature in The Social Club?',
        created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        is_mine: false,
        is_read: false,
      },
      unread_count: 1,
    },
    {
      user: mockUsers[1],
      last_message: {
        id: 2,
        content: 'The real-time chat endpoints are fully working now.',
        created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        is_mine: true,
        is_read: true,
      },
      unread_count: 0,
    },
    {
      user: mockUsers[2],
      last_message: {
        id: 3,
        content: 'Sounds great, see you at the community showcase tomorrow!',
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        is_mine: false,
        is_read: true,
      },
      unread_count: 0,
    },
  ];

  const mockThreadHistory = {
    101: [
      {
        id: 11,
        sender_id: 101,
        recipient_id: 1,
        content: 'Hey there! Welcome to the new SocialClub messaging experience.',
        created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        is_mine: false,
        is_read: true,
      },
      {
        id: 12,
        sender_id: 1,
        recipient_id: 101,
        content: 'Hey Sarah! This split-pane view with instant search is super smooth.',
        created_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
        is_mine: true,
        is_read: true,
      },
      {
        id: 13,
        sender_id: 101,
        recipient_id: 1,
        content: 'Hey! Have you seen the new direct messages feature in The Social Club?',
        created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        is_mine: false,
        is_read: false,
      },
    ],
    102: [
      {
        id: 21,
        sender_id: 102,
        recipient_id: 1,
        content: 'Testing the API routes for conversations and messages.',
        created_at: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
        is_mine: false,
        is_read: true,
      },
      {
        id: 22,
        sender_id: 1,
        recipient_id: 102,
        content: 'The real-time chat endpoints are fully working now.',
        created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        is_mine: true,
        is_read: true,
      },
    ],
    103: [
      {
        id: 31,
        sender_id: 1,
        recipient_id: 103,
        content: 'Looking forward to the meetup!',
        created_at: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
        is_mine: true,
        is_read: true,
      },
      {
        id: 32,
        sender_id: 103,
        recipient_id: 1,
        content: 'Sounds great, see you at the community showcase tomorrow!',
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        is_mine: false,
        is_read: true,
      },
    ],
  };

  // DOM Elements
  const shell = document.querySelector('#dm-shell');
  const conversationsList = document.querySelector('#conversations-list');
  const searchConversationsInput = document.querySelector('#search-conversations-input');
  const placeholderView = document.querySelector('#dm-placeholder');
  const threadView = document.querySelector('#dm-thread-view');
  const backBtn = document.querySelector('#dm-back-btn');
  const partnerProfileLink = document.querySelector('#partner-profile-link');
  const partnerAvatar = document.querySelector('#thread-partner-avatar');
  const partnerName = document.querySelector('#thread-partner-name');
  const partnerUsername = document.querySelector('#thread-partner-username');
  const messagesContainer = document.querySelector('#messages-container');
  const messageForm = document.querySelector('#message-form');
  const messageInput = document.querySelector('#message-input');
  const sendBtn = document.querySelector('#send-btn');

  // Modal Elements
  const newMessageBtn = document.querySelector('#new-message-btn');
  const placeholderNewBtn = document.querySelector('#placeholder-new-btn');
  const modal = document.querySelector('#new-message-modal');
  const modalBackdrop = document.querySelector('#modal-backdrop');
  const modalCloseBtn = document.querySelector('#modal-close-btn');
  const modalUserSearch = document.querySelector('#modal-user-search');
  const modalUsersList = document.querySelector('#modal-users-list');
  const modalSearchStatus = document.querySelector('#modal-search-status');

  // Format Helpers
  function formatRelativeTime(dateInput) {
    const date = new Date(dateInput);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSec < 45) return 'Just now';
    if (diffMin < 60) return `${diffMin}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }

  function formatMessageTime(dateInput) {
    return new Date(dateInput).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  }

  function formatDateDivider(dateInput) {
    const date = new Date(dateInput);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    if (isToday) return 'Today';

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';

    return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  }

  function setAvatar(element, user) {
    element.replaceChildren();
    if (user.profile_photo_url) {
      element.textContent = '';
      element.style.backgroundImage = `url("${user.profile_photo_url.replace(/"/g, '')}")`;
    } else {
      element.style.backgroundImage = '';
      element.textContent = (user.username || '?').charAt(0).toUpperCase();
    }
  }

  // Inject fallback navigation bar if opened directly without Express replacing <!-- SHARED_NAV -->
  function ensureNavigation() {
    if (document.querySelector('.app-aside')) return;
    const appShell = document.querySelector('.app-shell');
    if (!appShell) return;

    const aside = document.createElement('aside');
    aside.className = 'app-aside';
    aside.innerHTML = `
      <a class="app-brand" href="index.html">The Social Club</a>
      <nav class="app-nav" aria-label="Main navigation">
        <a class="app-nav__link" data-nav-id="for-you" href="index.html"><span class="app-nav__icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 11 9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg></span><span class="app-nav__label">For you</span></a>
        <a class="app-nav__link" data-nav-id="add-post" href="newPost.html"><span class="app-nav__icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg></span><span class="app-nav__label">Add post</span></a>
        <a class="app-nav__link" data-nav-id="search" href="search.html"><span class="app-nav__icon"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 5 5"/></svg></span><span class="app-nav__label">Search</span></a>
        <a class="app-nav__link" data-nav-id="messages" href="messages.html" aria-current="page"><span class="app-nav__icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5.5h18v13H3z"/><path d="m3 6 9 7 9-7"/></svg></span><span class="app-nav__label">Messages</span></a>
        <a class="app-nav__link" data-nav-id="activity" href="activity.html"><span class="app-nav__icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/></svg></span><span class="app-nav__label">Activity</span></a>
        <a class="app-nav__link" data-nav-id="profile" href="profile.html"><span class="app-nav__icon"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="3.5"/></svg></span><span class="app-nav__label">Profile</span></a>
        <button class="theme-toggle app-theme-toggle" type="button" data-theme-toggle aria-label="Switch theme">&#9684;</button>
      </nav>
    `;
    appShell.prepend(aside);

    const toggle = aside.querySelector('[data-theme-toggle]');
    if (toggle) {
      toggle.addEventListener('click', () => {
        const themes = ['light', 'dark', 'ocean', 'forest-crimson', 'lemon-charcoal', 'mocha-gold', 'ice-aubergine', 'platinum-mocha', 'oatmeal-pine'];
        const currentTheme = document.documentElement.dataset.theme || 'light';
        const next = themes[(themes.indexOf(currentTheme) + 1) % themes.length];
        document.documentElement.dataset.theme = next;
        localStorage.setItem('socialclub-theme', next);
      });
    }
  }

  // Load Conversations
  async function loadConversations(maintainSelection = true) {
    if (isPreviewMode) {
      renderConversationsList();
      if (activePartner && maintainSelection) {
        highlightActiveConversation(activePartner.id);
      }
      return;
    }

    try {
      const res = await fetch('/api/messages/conversations');
      if (res.status === 401) {
        if (window.location.protocol.startsWith('http')) return window.location.replace('/login');
        return;
      }
      if (!res.ok) throw new Error('Could not load conversations.');
      const data = await res.json();
      conversations = data.conversations || [];
      renderConversationsList();

      if (activePartner && maintainSelection) {
        highlightActiveConversation(activePartner.id);
      }
    } catch (err) {
      console.warn('Backend unavailable, maintaining current conversation view:', err.message);
    }
  }

  // Render Conversations List
  function renderConversationsList() {
    const query = (searchConversationsInput.value || '').trim().toLowerCase();
    const filtered = query
      ? conversations.filter(
          (c) =>
            c.user.username.toLowerCase().includes(query) ||
            (c.user.display_name && c.user.display_name.toLowerCase().includes(query)) ||
            (c.last_message && c.last_message.content.toLowerCase().includes(query))
        )
      : conversations;

    conversationsList.replaceChildren();

    if (filtered.length === 0) {
      const emptyLi = document.createElement('li');
      emptyLi.className = 'dm-empty-state';
      emptyLi.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        <strong>${query ? 'No matching conversations' : 'No messages yet'}</strong>
        <p>${query ? 'Try searching for someone else.' : 'Connect with members and start private chats.'}</p>
        ${!query ? '<button class="btn" id="empty-start-chat-btn" type="button">Start a chat</button>' : ''}
      `;
      conversationsList.appendChild(emptyLi);

      const startChatBtn = emptyLi.querySelector('#empty-start-chat-btn');
      if (startChatBtn) {
        startChatBtn.addEventListener('click', openNewMessageModal);
      }
      return;
    }

    filtered.forEach((conv) => {
      const item = document.createElement('li');
      item.className = 'dm-conv-item';
      item.dataset.userId = conv.user.id;
      if (activePartner && activePartner.id === conv.user.id) {
        item.classList.add('is-active');
      }
      if (conv.unread_count > 0) {
        item.classList.add('is-unread');
      }

      // Avatar
      const avatar = document.createElement('div');
      avatar.className = 'dm-avatar';
      setAvatar(avatar, conv.user);

      // Body
      const body = document.createElement('div');
      body.className = 'dm-conv-body';

      // Row 1
      const row1 = document.createElement('div');
      row1.className = 'dm-conv-row';

      const nameWrap = document.createElement('div');
      nameWrap.style.display = 'flex';
      nameWrap.style.alignItems = 'baseline';
      nameWrap.style.gap = '6px';
      nameWrap.style.minWidth = '0';
      nameWrap.style.overflow = 'hidden';

      const name = document.createElement('span');
      name.className = 'dm-conv-name';
      name.textContent = conv.user.display_name || conv.user.username;

      const handle = document.createElement('span');
      handle.className = 'dm-conv-username';
      handle.textContent = `@${conv.user.username}`;

      nameWrap.append(name, handle);

      const time = document.createElement('span');
      time.className = 'dm-conv-time';
      time.textContent = conv.last_message ? formatRelativeTime(conv.last_message.created_at) : '';

      row1.append(nameWrap, time);

      // Row 2
      const row2 = document.createElement('div');
      row2.className = 'dm-conv-row';

      const preview = document.createElement('p');
      preview.className = 'dm-conv-preview';
      if (conv.last_message) {
        const prefix = conv.last_message.is_mine ? 'You: ' : '';
        preview.textContent = `${prefix}${conv.last_message.content}`;
      } else {
        preview.textContent = 'No messages yet';
      }

      row2.append(preview);

      if (conv.unread_count > 0) {
        const badge = document.createElement('span');
        badge.className = 'dm-unread-badge';
        badge.textContent = conv.unread_count > 99 ? '99+' : conv.unread_count;
        row2.append(badge);
      }

      body.append(row1, row2);
      item.append(avatar, body);

      item.addEventListener('click', () => {
        selectConversation(conv.user);
      });

      conversationsList.appendChild(item);
    });
  }

  function highlightActiveConversation(userId) {
    document.querySelectorAll('.dm-conv-item').forEach((item) => {
      if (Number(item.dataset.userId) === Number(userId)) {
        item.classList.add('is-active');
        item.classList.remove('is-unread');
        const badge = item.querySelector('.dm-unread-badge');
        if (badge) badge.remove();
      } else {
        item.classList.remove('is-active');
      }
    });
  }

  // Select a Conversation Partner
  async function selectConversation(user) {
    if (!user || !user.id) return;
    activePartner = user;

    // Update active UI state
    highlightActiveConversation(user.id);
    shell.classList.add('has-active-thread');
    placeholderView.hidden = true;
    threadView.hidden = false;

    // Thread header
    partnerName.textContent = user.display_name || user.username;
    partnerUsername.textContent = `@${user.username}`;
    setAvatar(partnerAvatar, user);
    partnerProfileLink.href = `/profile?user=${encodeURIComponent(user.username)}`;

    // Update URL parameter without reload if on http
    if (window.location.protocol.startsWith('http')) {
      const url = new URL(window.location);
      url.searchParams.set('with', user.id);
      window.history.replaceState({}, '', url);
    }

    // Reset input
    messageInput.value = '';
    sendBtn.disabled = true;
    adjustTextareaHeight();
    messageInput.focus();

    // Fetch messages
    await loadMessages(user.id, true);
  }

  // Load Messages for Active Thread
  async function loadMessages(partnerId, shouldScrollToBottom = false) {
    if (isPreviewMode) {
      activeMessages = mockThreadHistory[partnerId] || [];
      renderMessages();
      if (shouldScrollToBottom) scrollToBottom();
      return;
    }

    try {
      const res = await fetch(`/api/messages/${partnerId}`);
      if (res.status === 401 && window.location.protocol.startsWith('http')) {
        return window.location.replace('/login');
      }
      if (!res.ok) throw new Error('Could not load messages.');
      const data = await res.json();

      activePartner = data.user;
      const newMessages = data.messages || [];

      const isDifferent =
        newMessages.length !== activeMessages.length ||
        (newMessages.length > 0 &&
          newMessages[newMessages.length - 1].id !== (activeMessages[activeMessages.length - 1]?.id || -1));

      if (isDifferent || shouldScrollToBottom) {
        activeMessages = newMessages;
        renderMessages();
        if (shouldScrollToBottom) {
          scrollToBottom();
        }
      }
    } catch (err) {
      console.warn('Could not load live messages:', err.message);
    }
  }

  // Render Messages
  function renderMessages() {
    messagesContainer.replaceChildren();

    if (activeMessages.length === 0) {
      const intro = document.createElement('div');
      intro.className = 'dm-placeholder';
      intro.style.height = 'auto';
      intro.style.padding = 'var(--space-8) 0';
      intro.innerHTML = `
        <div class="dm-avatar dm-avatar--lg">${(activePartner.username || '?').charAt(0).toUpperCase()}</div>
        <h2 style="font-size: var(--text-lg); margin-top: var(--space-2);">${escapeHtml(activePartner.display_name || activePartner.username)}</h2>
        <p style="font-size: var(--text-sm); color: var(--text-secondary);">@${escapeHtml(activePartner.username)}</p>
        ${activePartner.bio ? `<p class="dm-thread__bio">${escapeHtml(activePartner.bio)}</p>` : ''}
        <p style="font-size: var(--text-xs); color: var(--text-tertiary); margin-top: var(--space-4);">This is the beginning of your direct message history.</p>
      `;
      const avatarEl = intro.querySelector('.dm-avatar');
      setAvatar(avatarEl, activePartner);
      messagesContainer.appendChild(intro);
      return;
    }

    let lastDateStr = null;

    activeMessages.forEach((msg, idx) => {
      const msgDate = new Date(msg.created_at);
      const dateStr = msgDate.toDateString();

      // Date divider
      if (dateStr !== lastDateStr) {
        lastDateStr = dateStr;
        const divider = document.createElement('div');
        divider.className = 'dm-date-divider';
        const span = document.createElement('span');
        span.textContent = formatDateDivider(msg.created_at);
        divider.appendChild(span);
        messagesContainer.appendChild(divider);
      }

      // Message Element
      const msgEl = document.createElement('div');
      msgEl.className = `dm-message ${msg.is_mine ? 'dm-message--outgoing' : 'dm-message--incoming'}`;
      msgEl.dataset.messageId = msg.id;

      const bubble = document.createElement('div');
      bubble.className = 'dm-message__bubble';
      bubble.textContent = msg.content;

      const meta = document.createElement('div');
      meta.className = 'dm-message__meta';

      const time = document.createElement('span');
      time.textContent = formatMessageTime(msg.created_at);
      meta.appendChild(time);

      if (msg.is_mine) {
        const isLastMine = idx === activeMessages.length - 1 || activeMessages.slice(idx + 1).every((m) => !m.is_mine);
        if (isLastMine) {
          const status = document.createElement('span');
          status.className = `dm-message__status ${msg.is_read ? 'dm-message__status--seen' : ''}`;
          status.innerHTML = msg.is_read
            ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 6 7 17l-5-5"/><path d="m22 10-7.5 7.5L13 16"/></svg>'
            : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6 9 17l-5-5"/></svg>';
          status.title = msg.is_read ? 'Seen' : 'Sent';
          meta.appendChild(status);
        }
      }

      msgEl.append(bubble, meta);
      messagesContainer.appendChild(msgEl);
    });
  }

  function scrollToBottom() {
    requestAnimationFrame(() => {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    });
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text || '';
    return div.innerHTML;
  }

  function adjustTextareaHeight() {
    messageInput.style.height = 'auto';
    const newHeight = Math.min(messageInput.scrollHeight, 120);
    messageInput.style.height = `${newHeight}px`;
    sendBtn.disabled = !messageInput.value.trim() || isSending;
  }

  // Send Message
  async function handleSendMessage(event) {
    if (event) event.preventDefault();
    if (!activePartner || isSending) return;

    const content = messageInput.value.trim();
    if (!content) return;

    isSending = true;
    sendBtn.disabled = true;

    // Handle Preview Mode (Offline / local file)
    if (isPreviewMode) {
      const newMsg = {
        id: Date.now(),
        sender_id: 1,
        recipient_id: activePartner.id,
        content,
        created_at: new Date().toISOString(),
        is_mine: true,
        is_read: true,
      };

      if (!mockThreadHistory[activePartner.id]) {
        mockThreadHistory[activePartner.id] = [];
      }
      mockThreadHistory[activePartner.id].push(newMsg);
      activeMessages = mockThreadHistory[activePartner.id];

      // Update mock conversation snippet
      const existingConv = conversations.find((c) => c.user.id === activePartner.id);
      if (existingConv) {
        existingConv.last_message = newMsg;
      } else {
        conversations.unshift({
          user: activePartner,
          last_message: newMsg,
          unread_count: 0,
        });
      }

      messageInput.value = '';
      adjustTextareaHeight();
      renderMessages();
      scrollToBottom();
      renderConversationsList();
      highlightActiveConversation(activePartner.id);

      isSending = false;
      sendBtn.disabled = !messageInput.value.trim();
      messageInput.focus();

      // Optional realistic mock reply after 1.2s in preview mode
      setTimeout(() => {
        if (activePartner && activePartner.id === newMsg.recipient_id) {
          const replyMsg = {
            id: Date.now() + 1,
            sender_id: activePartner.id,
            recipient_id: 1,
            content: `Got it! This mock preview demonstrates real-time responses.`,
            created_at: new Date().toISOString(),
            is_mine: false,
            is_read: true,
          };
          mockThreadHistory[activePartner.id].push(replyMsg);
          if (existingConv) existingConv.last_message = replyMsg;
          renderMessages();
          scrollToBottom();
          renderConversationsList();
          highlightActiveConversation(activePartner.id);
        }
      }, 1200);

      return;
    }

    // Handle Live Backend Mode
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientId: activePartner.id,
          content,
        }),
      });

      if (res.status === 401 && window.location.protocol.startsWith('http')) {
        return window.location.replace('/login');
      }
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Failed to send message.');
        return;
      }

      const { message } = await res.json();

      messageInput.value = '';
      adjustTextareaHeight();

      activeMessages.push(message);
      renderMessages();
      scrollToBottom();

      await loadConversations(true);
    } catch (err) {
      console.error(err);
      alert('Could not send message. Please check server connection.');
    } finally {
      isSending = false;
      sendBtn.disabled = !messageInput.value.trim();
      messageInput.focus();
    }
  }

  // Close Active Thread / Mobile Back
  function closeActiveThread() {
    activePartner = null;
    activeMessages = [];
    shell.classList.remove('has-active-thread');
    placeholderView.hidden = false;
    threadView.hidden = true;

    document.querySelectorAll('.dm-conv-item').forEach((item) => {
      item.classList.remove('is-active');
    });

    if (window.location.protocol.startsWith('http')) {
      const url = new URL(window.location);
      url.searchParams.delete('with');
      url.searchParams.delete('user');
      window.history.replaceState({}, '', url.pathname);
    }
  }

  // Modal Handlers
  function openNewMessageModal() {
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    modalUserSearch.value = '';
    searchUsersForModal('');
    setTimeout(() => modalUserSearch.focus(), 50);
  }

  function closeNewMessageModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
  }

  async function searchUsersForModal(query) {
    modalSearchStatus.textContent = query ? 'Searching...' : 'Suggested members';
    modalUsersList.replaceChildren();

    if (isPreviewMode) {
      const filtered = query
        ? mockUsers.filter(
            (u) =>
              u.username.toLowerCase().includes(query.toLowerCase()) ||
              (u.display_name && u.display_name.toLowerCase().includes(query.toLowerCase()))
          )
        : mockUsers;

      renderModalUsers(filtered, query);
      return;
    }

    try {
      const url = query
        ? `/api/messages/users/search?q=${encodeURIComponent(query)}`
        : '/api/messages/users/search';
      const res = await fetch(url);
      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      const users = data.users || [];
      renderModalUsers(users, query);
    } catch {
      modalSearchStatus.textContent = 'Could not search users.';
    }
  }

  function renderModalUsers(users, query) {
    modalUsersList.replaceChildren();
    if (users.length === 0) {
      modalSearchStatus.textContent = query ? 'No users found.' : 'No suggested users yet.';
      return;
    }

    modalSearchStatus.textContent = query ? `${users.length} user(s) found:` : 'Suggested members:';

    users.forEach((user) => {
      const item = document.createElement('li');
      item.className = 'dm-user-item';

      const avatar = document.createElement('div');
      avatar.className = 'dm-avatar dm-avatar--sm';
      setAvatar(avatar, user);

      const info = document.createElement('div');
      info.className = 'dm-user-item__info';

      const name = document.createElement('span');
      name.className = 'dm-user-item__name';
      name.textContent = user.display_name || user.username;

      const handle = document.createElement('span');
      handle.className = 'dm-user-item__username';
      handle.textContent = `@${user.username}`;

      info.append(name, handle);

      if (user.bio) {
        const bio = document.createElement('span');
        bio.className = 'dm-user-item__bio';
        bio.textContent = user.bio;
        info.append(bio);
      }

      item.append(avatar, info);

      item.addEventListener('click', () => {
        closeNewMessageModal();
        selectConversation(user);
      });

      modalUsersList.appendChild(item);
    });
  }

  // Activate Local Preview Mode
  function activatePreviewMode() {
    isPreviewMode = true;
    currentUser = { id: 1, username: 'you', display_name: 'You' };
    conversations = [...mockConversations];

    ensureNavigation();

    // Insert banner above messages container
    const contentWrap = document.querySelector('.app-main__content');
    if (contentWrap && !document.querySelector('.dm-preview-banner')) {
      const banner = document.createElement('div');
      banner.className = 'dm-preview-banner';
      banner.innerHTML = `
        <div class="dm-preview-banner__content">
          <span class="dm-preview-banner__badge">Preview Mode</span>
          <span>You opened this HTML file directly (<code>file://</code>). To test real database persistence, start the server with <code>npm start</code> in Terminal and open <a href="http://localhost:3000/messages" target="_blank">http://localhost:3000/messages</a>.</span>
        </div>
      `;
      contentWrap.prepend(banner);
    }

    // Render conversations and auto-select first conversation
    renderConversationsList();
    if (conversations.length > 0) {
      selectConversation(conversations[0].user);
    }
  }

  // Event Listeners
  newMessageBtn.addEventListener('click', openNewMessageModal);
  placeholderNewBtn.addEventListener('click', openNewMessageModal);
  modalCloseBtn.addEventListener('click', closeNewMessageModal);
  modalBackdrop.addEventListener('click', closeNewMessageModal);
  backBtn.addEventListener('click', closeActiveThread);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) {
      closeNewMessageModal();
    }
  });

  modalUserSearch.addEventListener('input', (e) => {
    clearTimeout(searchDebounceTimer);
    const query = e.target.value.trim();
    searchDebounceTimer = setTimeout(() => {
      searchUsersForModal(query);
    }, 250);
  });

  searchConversationsInput.addEventListener('input', () => {
    renderConversationsList();
  });

  messageInput.addEventListener('input', adjustTextareaHeight);

  messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  });

  messageForm.addEventListener('submit', handleSendMessage);

  // Periodic Polling (only for live server mode)
  function startPolling() {
    stopPolling();
    if (isPreviewMode) return;

    pollTimer = setInterval(async () => {
      if (document.hidden) return;

      if (activePartner) {
        await loadMessages(activePartner.id, false);
      }
      await loadConversations(true);
    }, 3500);
  }

  function stopPolling() {
    if (pollTimer) {
      clearInterval(pollTimer);
      pollTimer = null;
    }
  }

  window.addEventListener('beforeunload', stopPolling);

  // Initialize
  async function init() {
    const isFile = window.location.protocol === 'file:';

    // If opened directly from desktop/finder via file://
    if (isFile) {
      activatePreviewMode();
      return;
    }

    try {
      const userRes = await fetch('/api/auth/me');
      if (userRes.status === 401) {
        return window.location.replace('/login');
      }
      if (!userRes.ok) {
        activatePreviewMode();
        return;
      }

      const userData = await userRes.json();
      currentUser = userData.user;

      // Load initial conversations
      await loadConversations(false);

      // Check URL params (?with=userId or ?user=username)
      const params = new URLSearchParams(window.location.search);
      const withUserId = params.get('with');
      const withUsername = params.get('user');

      if (withUserId) {
        const found = conversations.find((c) => Number(c.user.id) === Number(withUserId));
        if (found) {
          selectConversation(found.user);
        } else {
          try {
            const res = await fetch(`/api/messages/${withUserId}`);
            if (res.ok) {
              const data = await res.json();
              selectConversation(data.user);
            }
          } catch (e) {
            console.error(e);
          }
        }
      } else if (withUsername) {
        try {
          const res = await fetch(`/api/messages/user/by-username/${encodeURIComponent(withUsername)}`);
          if (res.ok) {
            const data = await res.json();
            selectConversation(data.user);
          }
        } catch (e) {
          console.error(e);
        }
      }

      startPolling();
    } catch {
      // If server is not responding, fallback to preview mode instead of broken error screen
      activatePreviewMode();
    }
  }

  init();
})();
