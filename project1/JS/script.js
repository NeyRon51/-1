const fileInput = document.getElementById('file-input');
const profilePic = document.getElementById('profile-pic');

fileInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      profilePic.src = e.target.result;
      localStorage.setItem('profilePhoto', e.target.result); // зберігаємо
    };
    reader.readAsDataURL(file);
  }
});

// якщо вже є фото — показуємо
const savedPhoto = localStorage.getItem('profilePhoto');
if (savedPhoto) {
  profilePic.src = savedPhoto;
}
