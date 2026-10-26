(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SocialClubValidation = factory();
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  const unsafeMarkup = /[<>\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;
  const emailPattern = /^\S+@\S+\.\S+$/;
  const usernamePattern = /^[a-zA-Z0-9_]{3,30}$/;

  function text(value, label, { required = false, max = 2000 } = {}) {
    if (typeof value !== 'string') return required ? `${label} is required.` : null;
    if (required && !value.trim()) return `${label} is required.`;
    if (value.length > max) return `${label} must be ${max} characters or fewer.`;
    if (unsafeMarkup.test(value)) return `${label} contains invalid characters.`;
    return null;
  }

  function signup(data) {
    if (!data || !data.email || !data.username || !data.password || !data.confirmPassword) return 'All signup fields are required.';
    if (text(data.email, 'Email', { required: true, max: 255 }) || !emailPattern.test(data.email)) return 'Enter a valid email address.';
    if (text(data.username, 'Username', { required: true, max: 30 }) || !usernamePattern.test(data.username)) return 'Username must be 3-30 letters, numbers, or underscores.';
    if (text(data.password, 'Password', { required: true, max: 128 })) return 'Password contains invalid characters.';
    if (data.password.length < 8) return 'Password must be at least 8 characters.';
    if (text(data.confirmPassword, 'Confirm password', { required: true, max: 128 })) return 'Confirm password contains invalid characters.';
    if (data.password !== data.confirmPassword) return 'Passwords do not match.';
    return null;
  }

  function login(data) {
    if (!data || !data.identifier || !data.password) return 'Username/email and password are required.';
    return text(data.identifier, 'Username/email', { required: true, max: 255 }) || ((!emailPattern.test(data.identifier) && !usernamePattern.test(data.identifier)) ? 'Enter a valid username or email address.' : null) || text(data.password, 'Password', { required: true, max: 128 }) || null;
  }

  function profile(data) {
    const displayNameError = data.displayName === undefined ? null : text(data.displayName, 'Display name', { required: true, max: 80 });
    const usernameError = data.username === undefined ? null : (text(data.username, 'Username', { required: true, max: 30 }) || !usernamePattern.test(data.username.trim().toLowerCase()) ? 'Username must be 3-30 lowercase letters, numbers, or underscores.' : null);
    const emailError = data.email === undefined ? null : (text(data.email, 'Email', { required: true, max: 255 }) || !emailPattern.test(data.email.trim()) ? 'Enter a valid email address.' : null);
    return displayNameError || usernameError || emailError || text(data.bio, 'Bio', { max: 160 }) || null;
  }

  function passwordChange(data) {
    if (!data || !data.currentPassword || !data.newPassword || !data.confirmPassword) return 'All password fields are required.';
    return text(data.currentPassword, 'Current password', { required: true, max: 128 }) || text(data.newPassword, 'New password', { required: true, max: 128 }) || text(data.confirmPassword, 'Confirm password', { required: true, max: 128 }) || (data.newPassword.length < 8 ? 'New password must be at least 8 characters.' : null) || (data.newPassword !== data.confirmPassword ? 'New passwords do not match.' : null);
  }

  function feedback(data) { return text(data && data.message, 'Feedback', { required: true, max: 2000 }); }
  function deleteAccount(data) { return text(data && data.password, 'Password', { required: true, max: 128 }); }
  function systemPost(data) { return text(data && data.caption, 'Notice', { required: true, max: 500 }); }

  return { text, signup, login, profile, passwordChange, feedback, deleteAccount, systemPost };
}));
