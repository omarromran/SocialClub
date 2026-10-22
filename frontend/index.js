fetch('/api/auth/me')
    .then(async (response) => {
        if (!response.ok) return window.location.replace('/login');
        const data = await response.json();
        document.querySelector('#welcome').textContent = `Logged in as ${data.user.username}`;
    })
    .catch(() => window.location.replace('/login'));

document.querySelector('#logout').addEventListener('click', async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.replace('/login');
});
