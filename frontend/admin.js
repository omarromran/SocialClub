const flash = document.querySelector('#flash');
const title = document.querySelector('#panel-title');

async function api(path, options = {}) {
  const response = await fetch(`/api/admin${path}`, options);
  const data = response.status === 204 ? {} : await response.json();
  if (!response.ok) throw new Error(data.error || 'The request failed.');
  return data;
}

function notify(message, error = false) {
  if (message === 'Something went wrong on the server.') return;
  flash.textContent = message;
  flash.hidden = false;
  flash.classList.toggle('is-error', error);
  window.setTimeout(() => { flash.hidden = true; }, 4000);
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>\'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
}

function formatDate(value) {
  return value ? new Date(value).toLocaleDateString() : '—';
}

async function loadUsers() {
  const query = document.querySelector('#user-search').value.trim();
  const { users } = await api(`/users${query ? `?q=${encodeURIComponent(query)}` : ''}`);
  document.querySelector('#user-rows').innerHTML = users.map((user) => `
    <tr><td><strong>${escapeHtml(user.display_name)}</strong><br><small>@${escapeHtml(user.username)}</small></td>
    <td>${user.is_admin ? 'Admin' : user.is_suspended ? 'Suspended' : 'Active'}</td>
    <td>${user.active_sessions}</td><td>${formatDate(user.password_changed_at)}</td>
    <td><button class="chip" data-user-action="suspend" data-id="${user.id}" data-suspended="${!user.is_suspended}">${user.is_suspended ? 'Restore' : 'Suspend'}</button>
    <button class="chip" data-user-action="sessions" data-id="${user.id}">Close sessions</button></td></tr>`).join('') || '<tr><td colspan="5">No users found.</td></tr>';
}

async function loadContent() {
  const [{ posts }, { comments }] = await Promise.all([api('/posts'), api('/comments')]);
  document.querySelector('#post-list').innerHTML = posts.map((post) => `<li><strong>@${escapeHtml(post.username)}</strong> ${escapeHtml(post.caption || '(no caption)')} <button class="chip" data-delete="/posts/${post.id}">Remove</button></li>`).join('');
  document.querySelector('#comment-list').innerHTML = comments.map((comment) => `<li><strong>@${escapeHtml(comment.username)}</strong> ${escapeHtml(comment.content)} <button class="chip" data-delete="/comments/${comment.id}">Remove</button></li>`).join('');
}

async function loadFeatures() {
  const { features } = await api('/features');
  document.querySelector('#feature-list').innerHTML = `${features.map((feature) => `<li><span>${feature.name}</span><button class="chip" data-feature="${feature.id}" data-enabled="${!feature.enabled}">${feature.enabled ? 'Enabled' : 'Disabled'}</button></li>`).join('')}
    <li class="kill-switch-row">
      <span><strong>The kill switch</strong><small>Clears all logged-in user sessions so the technical support team can fix bugs or respond during a cyber attack.</small></span>
      <button class="chip kill-switch" type="button" aria-pressed="true" disabled>Selected</button>
    </li>`;
}

async function loadTrends() {
  const { totals, popular } = await api('/trends');
  document.querySelector('#stat-row').innerHTML = Object.entries(totals).map(([name, value]) => `<div class="stat"><strong>${value}</strong><span>${name}</span></div>`).join('');
  document.querySelector('#popular-list').innerHTML = popular.map((post) => `<li><strong>@${escapeHtml(post.username)}</strong> ${escapeHtml(post.caption)} <span>${post.score} engagement</span></li>`).join('');
}

async function loadPanel(panel) {
  if (panel === 'users') return loadUsers();
  if (panel === 'content') return loadContent();
  if (panel === 'features') return loadFeatures();
  if (panel === 'trends') return loadTrends();
}

document.querySelectorAll('[data-tab]').forEach((button) => button.addEventListener('click', async () => {
  const panel = button.dataset.tab;
  document.querySelectorAll('[data-tab]').forEach((item) => item.classList.toggle('is-on', item === button));
  document.querySelectorAll('[data-panel]').forEach((item) => { item.hidden = item.dataset.panel !== panel; });
  title.textContent = button.textContent;
  try { await loadPanel(panel); } catch (error) { notify(error.message, true); }
}));

document.querySelector('#user-search').addEventListener('input', () => loadUsers().catch((error) => notify(error.message, true)));
document.querySelector('#refresh-users').addEventListener('click', () => loadUsers().catch((error) => notify(error.message, true)));
document.querySelector('#kick-password').addEventListener('click', async () => { try { const result = await api('/sessions/revoke-recent-password-changes', { method: 'POST' }); notify(`${result.closed} sessions closed.`); } catch (error) { notify(error.message, true); } });
document.querySelector('#logout').addEventListener('click', async () => { await fetch('/api/auth/logout', { method: 'POST' }); window.location.href = '/login'; });

document.addEventListener('click', async (event) => {
  const action = event.target.closest('[data-user-action]');
  const deletion = event.target.closest('[data-delete]');
  const feature = event.target.closest('[data-feature]');
  try {
    if (action) {
      const path = action.dataset.userAction === 'suspend' ? `/users/${action.dataset.id}/suspend` : `/users/${action.dataset.id}/sessions/revoke`;
      const options = action.dataset.userAction === 'suspend' ? { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ suspended: action.dataset.suspended === 'true' }) } : { method: 'POST' };
      notify((await api(path, options)).message); await loadUsers();
    } else if (deletion && window.confirm('Remove this item?')) { notify((await api(deletion.dataset.delete, { method: 'DELETE' })).message); await loadContent();
    } else if (feature) { notify((await api(`/features/${feature.dataset.feature}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ enabled: feature.dataset.enabled === 'true' }) })).message); await loadFeatures(); }
  } catch (error) { notify(error.message, true); }
});

document.querySelector('#notice-form').addEventListener('submit', async (event) => { event.preventDefault(); try { const form = new FormData(event.currentTarget); const values = { caption: form.get('caption') }; const validationError = SocialClubValidation.systemPost(values); if (validationError) throw new Error(validationError); const response = await fetch('/api/admin/system-post', { method: 'POST', body: JSON.stringify(values), headers: { 'Content-Type': 'application/json' } }); const data = await response.json(); if (!response.ok) throw new Error(data.error); notify(data.message); event.currentTarget.reset(); } catch (error) { notify(error.message, true); } });

loadUsers().catch((error) => notify(error.message, true));
