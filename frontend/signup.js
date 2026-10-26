const form = document.querySelector('#signup-form');
const username = document.querySelector('#username');
const usernameMessage = document.querySelector('#username-message');
const message = document.querySelector('.message');
username.addEventListener('input', () => {
    const valid = /^[a-zA-Z0-9_]{3,30}$/.test(username.value); usernameMessage.textContent = valid || !username.value ? '' : 'Use 3-30 letters, numbers, or underscores.';
    username.setCustomValidity(valid || !username.value ? '' : 'Invalid username');
});
form.addEventListener('submit', async (event) => { event.preventDefault(); message.textContent = ''; const values = Object.fromEntries(new FormData(form)); const validationError = SocialClubValidation.signup(values); if (validationError) { message.textContent = validationError; return; } const response = await fetch('/api/auth/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) }); const data = await response.json(); if (!response.ok) { message.textContent = data.error; return; } window.location.href = '/'; });
