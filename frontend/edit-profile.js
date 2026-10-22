const profileForm = document.querySelector('#profile-form');
const bioInput = document.querySelector('#bio');
const pictureInput = document.querySelector('#profile-picture');
const picturePreview = document.querySelector('#profile-picture-preview');
const removePictureButton = document.querySelector('#remove-profile-picture');
const message = document.querySelector('.message');
const submitButton = profileForm.querySelector('button[type="submit"]');

const setMessage = (text, type = 'error') => {
  message.textContent = text;
  message.classList.toggle('message--success', type === 'success');
};

fetch('/api/profile').then((response) => response.json()).then(({ user }) => {
  bioInput.value = user.bio || '';
  if (user.profile_photo_url) {
    picturePreview.src = user.profile_photo_url;
    picturePreview.hidden = false;
    removePictureButton.hidden = false;
  }
}).catch(() => window.location.replace('/login'));

pictureInput.addEventListener('change', () => {
  const [file] = pictureInput.files;
  if (!file) return;
  picturePreview.src = URL.createObjectURL(file);
  picturePreview.hidden = false;
});

removePictureButton.addEventListener('click', async () => {
  setMessage('');
  removePictureButton.disabled = true;
  removePictureButton.textContent = 'Removing...';
  try {
    const response = await fetch('/api/profile/picture', { method: 'DELETE' });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error || 'Could not remove your profile picture.');
      return;
    }
    pictureInput.value = '';
    picturePreview.removeAttribute('src');
    picturePreview.hidden = true;
    removePictureButton.hidden = true;
    setMessage('Profile picture removed.', 'success');
  } catch {
    setMessage('Could not remove your profile picture.');
  } finally {
    removePictureButton.disabled = false;
    removePictureButton.textContent = 'Remove profile picture';
  }
});

profileForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  setMessage('');
  submitButton.disabled = true;
  submitButton.textContent = 'Saving...';
  try {
    const response = await fetch('/api/profile', { method: 'PATCH', body: new FormData(profileForm) });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error || 'Could not update your profile.');
      return;
    }
    window.location.href = '/profile';
  } catch {
    setMessage('Could not update your profile.');
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = 'Save profile';
  }
});
