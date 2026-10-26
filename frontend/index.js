fetch('/api/profile')
    .then(async (response) => {
        if (!response.ok) return window.location.replace('/login');
        const { user } = await response.json();
        document.querySelector('#welcome').textContent = `Logged in as ${user.username}`;
        const avatar = document.querySelector('#composer-avatar');
        if (user.profile_photo_url) {
            avatar.textContent = '';
            avatar.style.backgroundImage = `url("${user.profile_photo_url.replace(/"/g, '')}")`;
            avatar.classList.add('composer-avatar--image');
        } else {
            avatar.textContent = user.username.charAt(0).toUpperCase();
        }
    })
    .catch(() => window.location.replace('/login'));

document.querySelector('#logout').addEventListener('click', async () => {
    const logoutButton = document.querySelector('#logout');
    logoutButton.disabled = true;
    await fetch('/api/auth/logout', { method: 'POST', cache: 'no-store' });
    window.location.replace('/login');
});
