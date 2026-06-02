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
            <span class="info-label">🗓 Ano</span>
            <span class="info-valor">${disco.ano}</span>
          </div>
          <div class="info-item">
            <span class="info-label">🏷 Gravadora</span>
            <span class="info-valor">${disco.gravadora}</span>
          </div>
          <div class="info-item">
            <span class="info-label">⏱ Duração</span>
            <span class="info-valor">${disco.duracao}</span>
          </div>
          <div class="info-item">
            <span class="info-label">🎵 Gênero</span>
            <span class="info-valor">${disco.genero}</span>
          </div>
          <div class="info-item">
            <span class="info-label">⭐ Avaliação</span>
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
          <span class="faixa-duracao">⏱ ${faixa.duracao}</span>
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
});
