const newPostForm = document.querySelector('#new-post-form');
if (newPostForm) {
  newPostForm.addEventListener('submit', (event) => {
    event.preventDefault();
  });
}
