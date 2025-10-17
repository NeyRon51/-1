const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');

const API_BASE = ''; 

if (registerBtn) registerBtn.addEventListener('click', () => container.classList.add("active"));
if (loginBtn) loginBtn.addEventListener('click', () => container.classList.remove("active"));

if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;

    try {
      const res = await fetch(`${API_BASE}/api/register`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ name, email, password }),
        credentials: 'include'
      });
      const data = await res.json();
      if (!res.ok) { alert(data.error || 'Registration failed'); return; }
      alert('Registered: ' + data.user.name);
      window.location.href = '/';
    } catch (err) {
      console.error(err);
      alert('Network error');
    }
  });
}

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    try {
      const res = await fetch(`${API_BASE}/api/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });
      const data = await res.json();
      if (!res.ok) { alert(data.error || 'Login failed'); return; }
      alert('Welcome, ' + data.user.name);
      window.location.href = '/';
    } catch (err) {
      console.error(err);
      alert('Network error');
    }
  });
}

async function logout() {
  await fetch('/api/logout', { method: 'POST', credentials: 'include' });
  window.location.reload();
}

(async function () {
  try {
    const res = await fetch('/api/me', { credentials: 'include' });
    const { user } = await res.json();
    if (user) {
      console.log('Logged in as', user);
    }
  } catch (err) {
    console.error(err);
  }
})();