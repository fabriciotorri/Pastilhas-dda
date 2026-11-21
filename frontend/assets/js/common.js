// ==========================================
// CABEÇALHO E NAVEGAÇÃO CENTRALIZADOS
// ==========================================

function injectHeader() {
  const header = document.querySelector('header');
  if (!header) return;

  const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';

  const navLinks = [
    { href: 'dashboard.html', label: 'Dashboard' },
    { href: 'pastilhas.html', label: 'Pastilhas' },
    { href: 'fornecedores.html', label: 'Fornecedores' },
    { href: 'movimentacoes.html', label: 'Movimentações' },
    { href: 'relatorios.html', label: 'Relatórios' },
  ];

  const navItemsHtml = navLinks
    .map((link) => {
      const isActive = currentPage.toLowerCase() === link.href.toLowerCase();
      const classes = isActive
        ? 'text-brand-500 font-semibold border-b-2 border-brand-500 pb-1 transition-colors'
        : 'text-slate-600 hover:text-brand-500 font-medium pb-1 transition-colors';

      return `<a href="${link.href}" class="${classes}">${link.label}</a>`;
    })
    .join('');

  header.className = 'bg-white border-b border-slate-200';
  header.innerHTML = `
    <div class="px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
      <div class="flex items-center gap-4">
        <a href="dashboard.html" class="text-brand-500 font-semibold text-xl hover:text-brand-600 transition-colors">
          Pastilha Fácil
        </a>
        <span class="text-slate-800 font-medium text-base lg:text-lg hidden sm:block">
          Sistema de Controle de Estoque de Pastilhas
        </span>
      </div>

      <div class="flex items-center gap-6">
        <div class="relative">
          <button
            type="button"
            aria-label="Configurações"
            aria-haspopup="true"
            id="settingsBtn"
            class="text-brand-500 text-xl hover:text-brand-600 transition-colors"
          >
            <i class="fa-solid fa-gear"></i>
          </button>

          <div
            id="settingsDropdown"
            class="hidden absolute top-10 right-0 bg-white min-w-[200px] shadow-lg border border-slate-200 rounded-md z-50 py-2"
          >
            <a href="#" class="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-500">
              <i class="fa-solid fa-sliders"></i> Preferências
            </a>
            <a href="#" class="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-500">
              <i class="fa-solid fa-lock"></i> Segurança
            </a>
            <a href="#" class="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-500">
              <i class="fa-solid fa-database"></i> Backup de Dados
            </a>
          </div>
        </div>

        <div class="relative">
          <button
            type="button"
            aria-label="Perfil do Usuário"
            aria-haspopup="true"
            id="profileBtn"
            class="w-10 h-10 rounded-full bg-brand-500 text-white font-semibold flex items-center justify-center hover:bg-brand-600 transition-colors"
          >
            U
          </button>

          <div
            id="profileDropdown"
            class="hidden absolute top-12 right-0 bg-white min-w-[220px] shadow-lg border border-slate-200 rounded-md z-50 py-2"
          >
            <div class="px-4 py-3 flex flex-col border-b border-slate-100">
              <strong id="userName" class="text-sm text-slate-900">Usuário</strong>
              <span id="userRole" class="text-xs text-slate-500">Administrador</span>
            </div>

            <a href="#" class="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-500 mt-1">
              <i class="fa-solid fa-user"></i> Meu Perfil
            </a>

            <button
              type="button"
              id="logoutButton"
              class="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <i class="fa-solid fa-right-from-bracket"></i> Sair
            </button>
          </div>
        </div>
      </div>
    </div>

    <nav class="border-t border-slate-100 px-6 py-3 flex flex-wrap justify-around items-center gap-4">
      ${navItemsHtml}
    </nav>
  `;
}

// ==========================================
// DADOS DO USUÁRIO NO CABEÇALHO
// ==========================================

function initializeHeader() {
  const storedName = localStorage.getItem('userName') || 'Usuário';
  const storedRole = localStorage.getItem('userRole') || 'Administrador';

  const userNameEl = document.getElementById('userName');
  const userRoleEl = document.getElementById('userRole');
  const profileBtn = document.getElementById('profileBtn');

  if (userNameEl) userNameEl.textContent = storedName;
  if (userRoleEl) userRoleEl.textContent = storedRole;
  if (profileBtn) profileBtn.textContent = storedName.charAt(0).toUpperCase();
}

// ==========================================
// DROPDOWNS (CONFIGURAÇÕES E PERFIL)
// ==========================================

function setupDropdowns() {
  const settingsBtn = document.getElementById('settingsBtn');
  const settingsDropdown = document.getElementById('settingsDropdown');
  const profileBtn = document.getElementById('profileBtn');
  const profileDropdown = document.getElementById('profileDropdown');

  if (settingsBtn && settingsDropdown) {
    settingsBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      settingsDropdown.classList.toggle('hidden');
      if (profileDropdown) profileDropdown.classList.add('hidden');
    });
  }

  if (profileBtn && profileDropdown) {
    profileBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      profileDropdown.classList.toggle('hidden');
      if (settingsDropdown) settingsDropdown.classList.add('hidden');
    });
  }

  document.addEventListener('click', () => {
    if (settingsDropdown) settingsDropdown.classList.add('hidden');
    if (profileDropdown) profileDropdown.classList.add('hidden');
  });
}

// ==========================================
// LOGOUT
// ==========================================

function setupLogout() {
  const logoutButton = document.getElementById('logoutButton');
  if (!logoutButton) return;

  logoutButton.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    window.location.href = 'login.html';
  });
}

// ==========================================
// INICIALIZAÇÃO
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  injectHeader();
  initializeHeader();
  setupDropdowns();
  setupLogout();
});
