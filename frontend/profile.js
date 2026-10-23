const modal = document.querySelector('#profile-modal');
const modalTitle = document.querySelector('#profile-modal-title');
const modalStatus = document.querySelector('#profile-modal-status');
const modalList = document.querySelector('#profile-modal-list');

const closeModal = () => {
  modal.hidden = true;
  document.body.style.overflow = '';
};

const openConnections = async (type) => {
  modalTitle.textContent = type === 'followers' ? 'Followers' : 'Following';
  modalStatus.textContent = 'Loading...';
  modalList.replaceChildren();
  modal.hidden = false;
  document.body.style.overflow = 'hidden';

  try {
    const response = await fetch(`/api/profile/${type}`);
    if (response.status === 401) return window.location.replace('/login');
    if (!response.ok) throw new Error('Could not load connections.');
    const { users } = await response.json();
    modalStatus.textContent = '';
    users.forEach((user) => {
      const item = document.createElement('li');
      item.className = 'profile-modal__item';
      const avatar = document.createElement('span');
      avatar.className = 'profile-modal__avatar';
      avatar.textContent = user.username.charAt(0).toUpperCase();
      if (user.profile_photo_url) avatar.style.backgroundImage = `url("${user.profile_photo_url.replace(/"/g, '')}")`;
      const name = document.createElement('span');
      name.textContent = `@${user.username}`;
      item.append(avatar, name);
      modalList.append(item);
    });
  } catch {
    modalStatus.textContent = `Could not load ${type}.`;
  }
};

document.querySelector('#followers-button').addEventListener('click', () => openConnections('followers'));
document.querySelector('#following-button').addEventListener('click', () => openConnections('following'));
document.querySelectorAll('[data-modal-close]').forEach((element) => element.addEventListener('click', closeModal));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !modal.hidden) closeModal();
});

fetch('/api/profile').then(async (response) => {
  if (!response.ok) return window.location.replace('/login');
  const { user, stats } = await response.json();
  document.querySelector('#profile-user').textContent = `@${user.username}`;
  document.querySelector('#profile-bio').textContent = user.bio || 'No bio yet.';
  document.querySelector('#post-count').textContent = stats.posts;
  document.querySelector('#follower-count').textContent = stats.followers;
  document.querySelector('#following-count').textContent = stats.following;
  const avatar = document.querySelector('#profile-avatar');
  if (user.profile_photo_url) {
    avatar.textContent = '';
    avatar.style.backgroundImage = `url("${user.profile_photo_url.replace(/"/g, '')}")`;
    avatar.classList.add('profile-avatar--image');
  } else {
    avatar.textContent = user.username.charAt(0).toUpperCase();
  }
}).catch(() => window.location.replace('/login'));
