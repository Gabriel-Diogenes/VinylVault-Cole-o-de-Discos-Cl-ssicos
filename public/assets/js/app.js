const API_BASE = 'http://localhost:3001';

function estrelas(n) {
  return '★'.repeat(n) + '☆'.repeat(5 - n);
}

function slugify(str) {
  return str.toLowerCase().replace(/\s+/g, '-');
}

async function initHome() {
  try {
    await montarCarousel();
    await montarCards();
  } catch (err) {
    console.error('Erro ao carregar dados da home:', err);
    mostrarErro('#carousel-section', 'Não foi possível conectar ao servidor. Verifique se o JSON Server está rodando na porta 3000.');
  }
}

async function montarCarousel() {
  const res = await fetch(`${API_BASE}/discos?destaque=true`);
  const destaques = await res.json();

  const inner = document.querySelector('#carouselVinyl .carousel-inner');
  const indicators = document.querySelector('#carouselVinyl .carousel-indicators');
  if (!inner) return;

  inner.innerHTML = '';
  if (indicators) indicators.innerHTML = '';

  destaques.forEach((disco, i) => {
    if (indicators) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.dataset.bsTarget = '#carouselVinyl';
      btn.dataset.bsSlideTo = i;
      btn.setAttribute('aria-label', `Slide ${i + 1}`);
      if (i === 0) { btn.classList.add('active'); btn.setAttribute('aria-current', 'true'); }
      indicators.appendChild(btn);
    }

    const item = document.createElement('div');
    item.className = `carousel-item${i === 0 ? ' active' : ''}`;
    item.innerHTML = `
      <div class="carousel-slide-inner" style="background-image: url('${disco.imagemPrincipal}')">
        <div class="carousel-overlay"></div>
        <div class="carousel-caption-custom">
          <span class="badge-genre">${disco.genero}</span>
          <h2 class="slide-title">${disco.nome}</h2>
          <p class="slide-artist">${disco.artista} · ${disco.ano}</p>
          <p class="slide-desc d-none d-md-block">${disco.descricao}</p>
          <a href="detalhe.html?id=${disco.id}" class="btn-vinyl">Ver Faixas</a>
        </div>
      </div>`;
    inner.appendChild(item);
  });
}

async function montarCards() {
  const res = await fetch(`${API_BASE}/discos`);
  const discos = await res.json();

  const grid = document.getElementById('discos-grid');
  if (!grid) return;

  grid.innerHTML = '';

  discos.forEach(disco => {
    const col = document.createElement('div');
    col.className = 'col-12 col-sm-6 col-lg-4 col-xl-3';
    col.innerHTML = `
      <article class="vinyl-card" onclick="window.location='detalhe.html?id=${disco.id}'">
        <div class="vinyl-card__cover">
          <img src="${disco.imagemPrincipal}" alt="Capa do álbum ${disco.nome}" loading="lazy">
          <div class="vinyl-card__hover-overlay">
            <span class="play-icon">▶</span>
          </div>
          ${disco.destaque ? '<span class="badge-destaque">Destaque</span>' : ''}
        </div>
        <div class="vinyl-card__body">
          <h3 class="vinyl-card__title">${disco.nome}</h3>
          <p class="vinyl-card__artist">${disco.artista}</p>
          <div class="vinyl-card__meta">
            <span class="vinyl-card__year">${disco.ano}</span>
            <span class="vinyl-card__genre">${disco.genero}</span>
          </div>
          <div class="vinyl-card__stars">${estrelas(disco.avaliacao)}</div>
        </div>
      </article>`;
    grid.appendChild(col);
  });
}

async function initDetalhe() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (!id) {
    window.location.href = 'index.html';
    return;
  }

  try {
    const [resD, resF] = await Promise.all([
      fetch(`${API_BASE}/discos/${id}`),
      fetch(`${API_BASE}/faixas?discoId=${id}`)
    ]);

    if (!resD.ok) throw new Error('Disco não encontrado');

    const disco = await resD.json();
    const faixas = await resF.json();

    montarDetalheInfo(disco);
    montarFaixas(faixas, disco.nome);

    document.title = `${disco.nome} — ${disco.artista} | VinylVault`;
  } catch (err) {
    console.error('Erro ao carregar detalhes:', err);
    mostrarErro('#detalhe-info', 'Não foi possível carregar as informações deste álbum.');
  }
}

function montarDetalheInfo(disco) {
  const container = document.getElementById('detalhe-info');
  if (!container) return;

  container.innerHTML = `
    <div class="row g-4 align-items-start">
      <div class="col-12 col-md-4">
        <div class="detalhe-cover-wrap">
          <img src="${disco.imagemPrincipal}" alt="Capa de ${disco.nome}" class="detalhe-cover img-fluid">
          <div class="vinyl-disc-shadow"></div>
        </div>
      </div>
      <div class="col-12 col-md-8">
        <div class="detalhe-header">
          <span class="detalhe-genre-badge">${disco.genero}</span>
          <h1 class="detalhe-titulo">${disco.nome}</h1>
          <h2 class="detalhe-artista">${disco.artista}</h2>
        </div>
        <div class="detalhe-infos-grid">
          <div class="info-item">
            <span class="info-label">Ano</span>
            <span class="info-valor">${disco.ano}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Gravadora</span>
            <span class="info-valor">${disco.gravadora}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Duração</span>
            <span class="info-valor">${disco.duracao}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Gênero</span>
            <span class="info-valor">${disco.genero}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Avaliação</span>
            <span class="info-valor stars">${estrelas(disco.avaliacao)}</span>
          </div>
        </div>
        <div class="detalhe-descricao">
          <h3 class="detalhe-section-label">Sobre o Álbum</h3>
          <p>${disco.conteudo}</p>
        </div>
        <a href="index.html" class="btn-back">← Voltar para a Coleção</a>
      </div>
    </div>`;
}

function montarFaixas(faixas, nomeAlbum) {
  const section = document.getElementById('faixas-section');
  if (!section) return;

  if (faixas.length === 0) {
    section.innerHTML = '<p class="text-muted fst-italic">Nenhuma faixa cadastrada para este álbum.</p>';
    return;
  }

  const titulo = section.querySelector('.faixas-titulo');
  if (titulo) titulo.textContent = `Faixas de "${nomeAlbum}"`;

  const row = section.querySelector('#faixas-row');
  if (!row) return;

  row.innerHTML = '';

  faixas.sort((a, b) => a.numero - b.numero).forEach(faixa => {
    const col = document.createElement('div');
    col.className = 'col-12 col-sm-6 col-md-4';
    col.innerHTML = `
      <div class="faixa-card">
        <div class="faixa-img-wrap">
          <img src="${faixa.imagem}" alt="${faixa.titulo}" loading="lazy">
          <span class="faixa-numero">${String(faixa.numero).padStart(2, '0')}</span>
        </div>
        <div class="faixa-info">
          <h4 class="faixa-titulo">${faixa.titulo}</h4>
          <span class="faixa-duracao">${faixa.duracao}</span>
          <p class="faixa-desc">${faixa.descricao}</p>
        </div>
      </div>`;
    row.appendChild(col);
  });
}

async function buscarDiscos(termo) {
  if (!termo || termo.trim().length < 2) {
    await montarCards();
    return;
  }

  const res = await fetch(`${API_BASE}/discos`);
  const todos = await res.json();
  const lower = termo.toLowerCase();

  const filtrados = todos.filter(d =>
    d.nome.toLowerCase().includes(lower) ||
    d.artista.toLowerCase().includes(lower) ||
    d.genero.toLowerCase().includes(lower)
  );

  const grid = document.getElementById('discos-grid');
  if (!grid) return;

  if (filtrados.length === 0) {
    grid.innerHTML = `<div class="col-12 text-center py-5">
      <p class="empty-search">Nenhum álbum encontrado para "<strong>${termo}</strong>"</p>
    </div>`;
    return;
  }

  grid.innerHTML = '';
  filtrados.forEach(disco => {
    const col = document.createElement('div');
    col.className = 'col-12 col-sm-6 col-lg-4 col-xl-3';
    col.innerHTML = `
      <article class="vinyl-card" onclick="window.location='detalhe.html?id=${disco.id}'">
        <div class="vinyl-card__cover">
          <img src="${disco.imagemPrincipal}" alt="Capa de ${disco.nome}" loading="lazy">
          <div class="vinyl-card__hover-overlay"><span class="play-icon">▶</span></div>
        </div>
        <div class="vinyl-card__body">
          <h3 class="vinyl-card__title">${disco.nome}</h3>
          <p class="vinyl-card__artist">${disco.artista}</p>
          <div class="vinyl-card__meta">
            <span class="vinyl-card__year">${disco.ano}</span>
            <span class="vinyl-card__genre">${disco.genero}</span>
          </div>
          <div class="vinyl-card__stars">${estrelas(disco.avaliacao)}</div>
        </div>
      </article>`;
    grid.appendChild(col);
  });
}

function mostrarErro(seletor, msg) {
  const el = document.querySelector(seletor);
  if (el) el.innerHTML = `<div class="alert-vinyl"><p>⚠️ ${msg}</p></div>`;
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('discos-grid')) {
    initHome();

    const inputBusca = document.getElementById('input-busca');
    const formBusca = document.getElementById('form-busca');
    if (formBusca) {
      formBusca.addEventListener('submit', e => {
        e.preventDefault();
        buscarDiscos(inputBusca?.value || '');
      });
    }
    if (inputBusca) {
      let debounce;
      inputBusca.addEventListener('input', () => {
        clearTimeout(debounce);
        debounce = setTimeout(() => buscarDiscos(inputBusca.value), 400);
      });
    }
  }

  if (document.getElementById('detalhe-info')) {
    initDetalhe();
  }

  if (document.getElementById('form-disco')) {
    initCadastro();
  }
});

const crud = {
  modoEdicao: false,
  idEditando: null,
  todosDiscos: [],
  idParaDeletar: null
};

function showToast(msg, tipo = 'sucesso') {
  const toast = document.getElementById('toast-feedback');
  if (!toast) return;
  toast.textContent = msg;
  toast.className = `crud-toast ${tipo} show`;
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 3200);
}

function validarForm() {
  const campos = [
    { id: 'campo-nome',      erroId: 'erro-nome',      msg: 'Informe o nome do álbum.' },
    { id: 'campo-artista',   erroId: 'erro-artista',   msg: 'Informe o artista ou banda.' },
    { id: 'campo-ano',       erroId: 'erro-ano',       msg: 'Informe um ano válido (1900–2099).', extra: v => v < 1900 || v > 2099 },
    { id: 'campo-avaliacao', erroId: 'erro-avaliacao', msg: 'Selecione uma avaliação.' },
    { id: 'campo-genero',    erroId: 'erro-genero',    msg: 'Informe o gênero musical.' },
    { id: 'campo-descricao', erroId: 'erro-descricao', msg: 'Escreva uma descrição curta.' },
  ];

  let valido = true;

  campos.forEach(({ id, erroId, msg, extra }) => {
    const input = document.getElementById(id);
    const erroEl = document.getElementById(erroId);
    const val = input?.value?.trim();
    const invalido = !val || (extra && extra(Number(val)));

    if (invalido) {
      input?.classList.add('invalido');
      if (erroEl) erroEl.textContent = msg;
      valido = false;
    } else {
      input?.classList.remove('invalido');
      if (erroEl) erroEl.textContent = '';
    }
  });

  return valido;
}

function lerFormulario() {
  return {
    nome:            document.getElementById('campo-nome')?.value.trim(),
    artista:         document.getElementById('campo-artista')?.value.trim(),
    ano:             Number(document.getElementById('campo-ano')?.value),
    avaliacao:       Number(document.getElementById('campo-avaliacao')?.value),
    genero:          document.getElementById('campo-genero')?.value.trim(),
    gravadora:       document.getElementById('campo-gravadora')?.value.trim() || '',
    duracao:         document.getElementById('campo-duracao')?.value.trim() || '',
    descricao:       document.getElementById('campo-descricao')?.value.trim(),
    conteudo:        document.getElementById('campo-conteudo')?.value.trim() || '',
    imagemPrincipal: document.getElementById('campo-imagem')?.value.trim()
                       || `https://picsum.photos/id/${Math.floor(Math.random()*100)+1}/600/600`,
    destaque:        document.getElementById('campo-destaque')?.checked ?? false,
  };
}

function preencherFormulario(disco) {
  document.getElementById('campo-id').value         = disco.id;
  document.getElementById('campo-nome').value       = disco.nome;
  document.getElementById('campo-artista').value    = disco.artista;
  document.getElementById('campo-ano').value        = disco.ano;
  document.getElementById('campo-avaliacao').value  = disco.avaliacao;
  document.getElementById('campo-genero').value     = disco.genero;
  document.getElementById('campo-gravadora').value  = disco.gravadora || '';
  document.getElementById('campo-duracao').value    = disco.duracao || '';
  document.getElementById('campo-descricao').value  = disco.descricao;
  document.getElementById('campo-conteudo').value   = disco.conteudo || '';
  document.getElementById('campo-imagem').value     = disco.imagemPrincipal || '';
  document.getElementById('campo-destaque').checked = disco.destaque ?? false;

  document.getElementById('campo-imagem').dispatchEvent(new Event('input'));

  crud.modoEdicao = true;
  crud.idEditando = disco.id;
  document.getElementById('form-titulo').textContent = 'Editar Disco';
  const badge = document.getElementById('form-modo-badge');
  badge.textContent = 'Editando';
  badge.classList.add('editando');
  document.getElementById('btn-salvar-text').textContent = 'Atualizar Disco';
  document.getElementById('btn-cancelar').style.display = 'inline-flex';

  document.querySelector('.crud-form-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function resetarFormulario() {
  document.getElementById('form-disco').reset();
  document.getElementById('campo-id').value = '';
  document.querySelectorAll('.campo-erro').forEach(el => el.textContent = '');
  document.querySelectorAll('.crud-input').forEach(el => el.classList.remove('invalido'));

  const wrap = document.getElementById('img-preview-wrap');
  if (wrap) wrap.style.display = 'none';

  crud.modoEdicao = false;
  crud.idEditando = null;
  document.getElementById('form-titulo').textContent = 'Novo Disco';
  const badge = document.getElementById('form-modo-badge');
  badge.textContent = 'Cadastro';
  badge.classList.remove('editando');
  document.getElementById('btn-salvar-text').textContent = 'Salvar Disco';
  document.getElementById('btn-cancelar').style.display = 'none';
}

async function carregarTabelaDiscos(filtro = '') {
  try {
    const res = await fetch(`${API_BASE}/discos`);
    if (!res.ok) throw new Error('Erro ao buscar discos');
    crud.todosDiscos = await res.json();
    renderizarTabela(filtro);
  } catch (err) {
    const tbody = document.getElementById('tabela-discos-body');
    if (tbody) tbody.innerHTML = `<tr class="tr-vazio"><td colspan="4">Não foi possível carregar os discos.</td></tr>`;
  }
}

function renderizarTabela(filtro = '') {
  const tbody = document.getElementById('tabela-discos-body');
  const countEl = document.getElementById('lista-count');
  if (!tbody) return;

  const lower = filtro.toLowerCase();
  const lista = filtro
    ? crud.todosDiscos.filter(d =>
        d.nome.toLowerCase().includes(lower) ||
        d.artista.toLowerCase().includes(lower))
    : crud.todosDiscos;

  if (countEl) countEl.textContent = `${lista.length} disco${lista.length !== 1 ? 's' : ''}`;

  if (lista.length === 0) {
    tbody.innerHTML = `<tr class="tr-vazio"><td colspan="4">Nenhum disco encontrado.</td></tr>`;
    return;
  }

  tbody.innerHTML = '';
  lista.forEach(disco => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <div class="td-album">
          <img
            src="${disco.imagemPrincipal || 'https://picsum.photos/id/1/40/40'}"
            alt="${disco.nome}"
            class="td-album-thumb"
            onerror="this.src='https://picsum.photos/id/1/40/40'"
          >
          <div>
            <span class="td-album-nome">${disco.nome}</span>
            ${disco.destaque ? '<span class="td-destaque-badge">★ Destaque</span>' : ''}
          </div>
        </div>
      </td>
      <td class="d-none d-md-table-cell">${disco.artista}</td>
      <td class="d-none d-sm-table-cell">${disco.ano}</td>
      <td>
        <div class="td-acoes">
          <a href="detalhe.html?id=${disco.id}" class="btn-acao ver" title="Ver detalhes">👁</a>
          <button class="btn-acao editar" title="Editar" onclick="editarDisco(${disco.id})"></button>
          <button class="btn-acao excluir" title="Excluir" onclick="confirmarDelete(${disco.id}, '${disco.nome.replace(/'/g, "\\'")}')">🗑</button>
        </div>
      </td>`;
    tbody.appendChild(tr);
  });
}

async function criarDisco(dados) {
  const res = await fetch(`${API_BASE}/discos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados)
  });
  if (!res.ok) throw new Error('Erro ao criar disco');
  return res.json();
}

async function atualizarDisco(id, dados) {
  const res = await fetch(`${API_BASE}/discos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...dados })
  });
  if (!res.ok) throw new Error('Erro ao atualizar disco');
  return res.json();
}

async function excluirDisco(id) {
  const res = await fetch(`${API_BASE}/discos/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Erro ao excluir disco');
  return true;
}

async function editarDisco(id) {
  try {
    const res = await fetch(`${API_BASE}/discos/${id}`);
    if (!res.ok) throw new Error();
    const disco = await res.json();
    preencherFormulario(disco);
  } catch {
    showToast('Não foi possível carregar o disco para edição.', 'erro');
  }
}

function confirmarDelete(id, nome) {
  crud.idParaDeletar = id;
  document.getElementById('modal-msg').textContent =
    `Tem certeza que deseja excluir "${nome}"? Esta ação não pode ser desfeita.`;
  document.getElementById('modal-delete').classList.add('aberto');
}

function initCadastro() {
  carregarTabelaDiscos();
  document.getElementById('form-disco')?.addEventListener('submit', async e => {
    e.preventDefault();
    if (!validarForm()) return;

    const dados = lerFormulario();
    const btnText = document.getElementById('btn-salvar-text');
    btnText.textContent = '⏳ Salvando...';

    try {
      if (crud.modoEdicao && crud.idEditando) {
        await atualizarDisco(crud.idEditando, dados);
        showToast(`"${dados.nome}" atualizado com sucesso!`, 'sucesso');
      } else {
        await criarDisco(dados);
        showToast(`"${dados.nome}" adicionado à coleção!`, 'sucesso');
      }
      resetarFormulario();
      await carregarTabelaDiscos();
    } catch (err) {
      showToast('Erro ao salvar. Verifique o JSON Server.', 'erro');
    } finally {
      btnText.textContent = crud.modoEdicao ? 'Atualizar Disco' : 'Salvar Disco';
    }
  });

  document.getElementById('btn-cancelar')?.addEventListener('click', () => {
    resetarFormulario();
    showToast('Edição cancelada.', 'info');
  });

  document.getElementById('btn-confirm-delete')?.addEventListener('click', async () => {
    if (!crud.idParaDeletar) return;
    try {
      await excluirDisco(crud.idParaDeletar);
      showToast('🗑 Disco excluído com sucesso.', 'sucesso');
      document.getElementById('modal-delete').classList.remove('aberto');
      crud.idParaDeletar = null;
      await carregarTabelaDiscos();
    } catch {
      showToast('Erro ao excluir. Tente novamente.', 'erro');
    }
  });

  document.getElementById('btn-cancel-delete')?.addEventListener('click', () => {
    document.getElementById('modal-delete').classList.remove('aberto');
    crud.idParaDeletar = null;
  });

  document.getElementById('modal-delete')?.addEventListener('click', e => {
    if (e.target === e.currentTarget) {
      e.currentTarget.style.display = 'none';
      crud.idParaDeletar = null;
    }
  });

  let debounceTabela;
  document.getElementById('filtro-lista')?.addEventListener('input', e => {
    clearTimeout(debounceTabela);
    debounceTabela = setTimeout(() => renderizarTabela(e.target.value), 300);
  });

  document.getElementById('campo-imagem')?.addEventListener('input', e => {
    const url = e.target.value.trim();
    const wrap = document.getElementById('img-preview-wrap');
    const img  = document.getElementById('img-preview');
    if (url && wrap && img) {
      img.src = url;
      img.onload  = () => { wrap.style.display = 'block'; };
      img.onerror = () => { wrap.style.display = 'none'; };
    } else if (wrap) {
      wrap.style.display = 'none';
    }
  });
}

window.editarDisco     = editarDisco;
window.confirmarDelete = confirmarDelete;
