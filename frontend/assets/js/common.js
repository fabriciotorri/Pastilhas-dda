// ==========================================
// NAVEGAÇÃO
// ==========================================

function injectNavigation() {
  const header = document.querySelector('header');

  if (!header) {
    return;
  }

  const nav = header.querySelector('nav');

  if (!nav) {
    return;
  }

  nav.className =
    'border-t border-slate-100 px-6 py-3 flex justify-around items-center';

  nav.innerHTML = `
    <a href="dashboard.html"
       class="hover:text-blue-600 transition">
      Dashboard
    </a>

    <a href="pastilhas.html"
       class="hover:text-blue-600 transition">
      Pastilhas
    </a>

    <a href="fornecedores.html"
       class="hover:text-blue-600 transition">
      Fornecedores
    </a>

    <a href="movimentacoes.html"
       class="hover:text-blue-600 transition">
      Movimentações
    </a>

    <a href="relatorios.html"
       class="hover:text-blue-600 transition">
      Relatórios
    </a>
  `;
}


// ==========================================
// CABEÇALHO
// ==========================================

function initializeHeader() {
  const userName = document.getElementById('userName');

  if (userName) {
    userName.textContent = 'Usuário';
  }
}


// ==========================================
// DROPDOWN DO USUÁRIO
// ==========================================

function setupDropdowns() {
  const userButton = document.getElementById('userMenuButton');
  const userMenu = document.getElementById('userMenu');

  if (!userButton || !userMenu) {
    return;
  }

  userButton.addEventListener('click', (event) => {
    event.stopPropagation();

    userMenu.classList.toggle('hidden');
  });

  document.addEventListener('click', () => {
    userMenu.classList.add('hidden');
  });
}


// ==========================================
// LOGOUT
// ==========================================

function setupLogout() {
  const logoutButton = document.getElementById('logoutButton');

  if (!logoutButton) {
    return;
  }

  logoutButton.addEventListener('click', () => {
    localStorage.removeItem('token');

    window.location.href = 'login.html';
  });
}


// ==========================================
// INICIALIZAÇÃO
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  injectNavigation();
  initializeHeader();
  setupDropdowns();
  setupLogout();
});