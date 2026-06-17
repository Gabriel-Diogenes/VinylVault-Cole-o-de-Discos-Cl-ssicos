const SESSION_KEY = 'vinylvault_usuario';

function getUsuarioLogado() {
  const raw = sessionStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

function setUsuarioLogado(usuario) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(usuario));
}

function logout() {
  sessionStorage.removeItem(SESSION_KEY);
  window.location.href = 'index.html';
}

function isAdmin() {
  const u = getUsuarioLogado();
  return u && u.admin === true;
}

function isLogado() {
  return getUsuarioLogado() !== null;
}

function atualizarMenu() {
  const usuario = getUsuarioLogado();
  const navGerenciar = document.getElementById('nav-gerenciar');
  const navFavoritos = document.getElementById('nav-favoritos');
  const navLogin = document.getElementById('nav-login');
  const navLogout = document.getElementById('nav-logout');

  if (navGerenciar) navGerenciar.hidden = !usuario?.admin;
  if (navFavoritos) navFavoritos.hidden = !usuario;
  if (navLogin) navLogin.hidden = !!usuario;
  if (navLogout) navLogout.hidden = !usuario;
}

function protegerPaginaAdmin() {
  if (!isAdmin()) window.location.href = 'index.html';
}

function protegerPaginaLogado() {
  if (!isLogado()) window.location.href = 'login.html';
}

async function fazerLogin(login, senha) {
  const res = await fetch(
    `${window.location.origin}/usuarios?login=${encodeURIComponent(login)}&senha=${encodeURIComponent(senha)}`
  );
  const usuarios = await res.json();
  if (usuarios.length > 0) {
    setUsuarioLogado(usuarios[0]);
    return { ok: true };
  }
  return { ok: false, msg: 'Login ou senha incorretos.' };
}

async function cadastrarUsuario(dados) {
  const check = await fetch(
    `${window.location.origin}/usuarios?login=${encodeURIComponent(dados.login)}`
  );
  const existentes = await check.json();
  if (existentes.length > 0) {
    return { ok: false, msg: 'Este login já está em uso.' };
  }

  const novo = {
    id: crypto.randomUUID(),
    login: dados.login,
    senha: dados.senha,
    nome: dados.nome,
    email: dados.email,
    admin: false
  };

  const res = await fetch(`${window.location.origin}/usuarios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(novo)
  });

  if (!res.ok) return { ok: false, msg: 'Erro ao cadastrar usuário.' };
  return { ok: true };
}

function initLoginPage() {
  const form = document.getElementById('form-login');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const login = document.getElementById('login-usuario')?.value.trim();
    const senha = document.getElementById('login-senha')?.value;
    const erroEl = document.getElementById('login-erro');

    if (!login || !senha) {
      if (erroEl) erroEl.textContent = 'Preencha login e senha.';
      return;
    }

    const resultado = await fazerLogin(login, senha);
    if (resultado.ok) {
      window.location.href = 'index.html';
    } else if (erroEl) {
      erroEl.textContent = resultado.msg;
    }
  });
}

function initCadastroUsuarioPage() {
  const form = document.getElementById('form-cadastro-usuario');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const erroEl = document.getElementById('cadastro-erro');
    const sucessoEl = document.getElementById('cadastro-sucesso');

    const dados = {
      nome: document.getElementById('cadastro-nome')?.value.trim(),
      login: document.getElementById('cadastro-login')?.value.trim(),
      email: document.getElementById('cadastro-email')?.value.trim(),
      senha: document.getElementById('cadastro-senha')?.value
    };

    if (!dados.nome || !dados.login || !dados.email || !dados.senha) {
      if (erroEl) erroEl.textContent = 'Preencha todos os campos.';
      return;
    }

    const resultado = await cadastrarUsuario(dados);
    if (resultado.ok) {
      if (erroEl) erroEl.textContent = '';
      if (sucessoEl) {
        sucessoEl.textContent = 'Cadastro realizado! Redirecionando ao login...';
        sucessoEl.hidden = false;
      }
      setTimeout(() => { window.location.href = 'login.html'; }, 1500);
    } else if (erroEl) {
      erroEl.textContent = resultado.msg;
      if (sucessoEl) sucessoEl.hidden = true;
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  atualizarMenu();

  document.getElementById('nav-logout')?.addEventListener('click', e => {
    e.preventDefault();
    logout();
  });

  initLoginPage();
  initCadastroUsuarioPage();
});
