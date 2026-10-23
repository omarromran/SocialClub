const form = document.querySelector('#login-form');
const message = document.querySelector('.message');

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    message.textContent = '';

    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form)))
    });

    const data = await response.json();

    if (!response.ok) {
        message.textContent = data.error;
        return;
    }

    window.location.href = '/';
});
