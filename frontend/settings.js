const requestJson = async (url, method, body) => {
  const response = await fetch(url, {
    method,
    cache: 'no-store',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  let data = {};
  if (response.status !== 204) {
    try { data = await response.json(); } catch { data = {}; }
  }
  if (!response.ok) throw new Error(data.error || 'Something went wrong. Please try again.');
  return data;
};

const showStatus = (element, message, state = '') => {
  element.textContent = message;
  if (state) element.dataset.state = state;
  else delete element.dataset.state;
};

const privacyToggle = document.querySelector('#private-account');
const privacyStatus = document.querySelector('#privacy-status');
privacyToggle.disabled = true;
requestJson('/api/auth/me', 'GET')
  .then(({ user }) => {
    privacyToggle.checked = Boolean(user.is_private);
    privacyToggle.disabled = false;
  })
  .catch((error) => {
    showStatus(privacyStatus, error.message, 'error');
    if (error.message.includes('log in') || error.message.includes('session')) window.location.replace('/login');
  });

privacyToggle.addEventListener('change', async () => {
  const requestedValue = privacyToggle.checked;
  privacyToggle.disabled = true;
  showStatus(privacyStatus, 'Saving…');
  try {
    const result = await requestJson('/api/auth/privacy', 'PATCH', { isPrivate: requestedValue });
    privacyToggle.checked = result.is_private;
    showStatus(privacyStatus, result.is_private ? 'Your account is private.' : 'Your account is public.', 'success');
  } catch (error) {
    privacyToggle.checked = !requestedValue;
    showStatus(privacyStatus, error.message, 'error');
  } finally {
    privacyToggle.disabled = false;
  }
});

document.querySelector('#password-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const submit = form.querySelector('[type="submit"]');
  const status = document.querySelector('#password-status');
  const values = Object.fromEntries(new FormData(form));
  const validationError = SocialClubValidation.passwordChange(values);
  if (validationError) { showStatus(status, validationError, 'error'); return; }
  submit.disabled = true;
  showStatus(status, 'Updating password…');
  try {
    const result = await requestJson('/api/auth/password', 'PATCH', values);
    form.reset();
    showStatus(status, result.message || 'Password updated successfully.', 'success');
  } catch (error) {
    showStatus(status, error.message, 'error');
  } finally {
    submit.disabled = false;
  }
});

document.querySelector('#feedback-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const submit = form.querySelector('[type="submit"]');
  const status = document.querySelector('#feedback-status');
  const message = new FormData(form).get('message');
  const validationError = SocialClubValidation.feedback({ message });
  if (validationError) { showStatus(status, validationError, 'error'); return; }
  submit.disabled = true;
  showStatus(status, 'Sending…');
  try {
    const result = await requestJson('/api/auth/feedback', 'POST', { message });
    form.reset();
    showStatus(status, result.message, 'success');
  } catch (error) {
    showStatus(status, error.message, 'error');
  } finally {
    submit.disabled = false;
  }
});

document.querySelector('#logout-button').addEventListener('click', async (event) => {
  const button = event.currentTarget;
  button.disabled = true;
  try {
    await requestJson('/api/auth/logout', 'POST');
    window.location.replace('/login');
  } catch (error) {
    button.disabled = false;
    showStatus(document.querySelector('#logout-status'), error.message, 'error');
  }
});

document.querySelector('#delete-account-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!window.confirm('Delete your account permanently? Your profile, posts, and account data will be removed.')) return;
  const form = event.currentTarget;
  const submit = form.querySelector('[type="submit"]');
  const status = document.querySelector('#delete-status');
  const password = new FormData(form).get('password');
  const validationError = SocialClubValidation.deleteAccount({ password });
  if (validationError) { showStatus(status, validationError, 'error'); return; }
  submit.disabled = true;
  showStatus(status, 'Deleting account…');
  try {
    await requestJson('/api/auth/account', 'DELETE', { password });
    localStorage.removeItem('socialclub-theme');
    window.location.replace('/signup');
  } catch (error) {
    showStatus(status, error.message, 'error');
    submit.disabled = false;
  }
});
