# 🎵 VinylVault — Coleção de Discos Clássicos

## 1. Dados Básicos

| Campo | Informação |
|---|---|
| **Nome** | Gabriel Alves da Silva Diógenes |
| **Matrícula** | 692997 |
| **Proposta Escolhida** | Proposta 4 — Coleções e Itens |
| **Entidade Principal** | Disco (álbum de vinil) |
| **Entidade Secundária** | Faixas (tracks) do álbum |

## 2. Descrição do Projeto

**VinylVault** é um acervo digital de discos de vinil clássicos. A aplicação exibe uma coleção curada dos álbuns mais influentes da história da música — de jazz a hip-hop nacional — com informações detalhadas sobre cada disco e suas faixas.

- A **home-page** exibe os álbuns em destaque via carrossel e todos os álbuns em um grid de cards dinâmico, com busca em tempo real.
- A **página de detalhe** apresenta as informações completas de um álbum (nome, artista, ano, gravadora, duração, gênero, avaliação e descrição) e lista todas as suas faixas com imagem, número, título, duração e descrição.
- A **página de gerenciamento** permite cadastrar, editar e excluir discos com CRUD completo.
- Todos os dados são obtidos por **requisições Fetch à API REST do JSON Server**.

## 3. Tecnologias Utilizadas

- HTML5 semântico
- CSS3 com variáveis e media queries
- JavaScript ES6+ (vanilla, sem frameworks)
- Bootstrap 5.3 (grid, carousel)
- JSON Server 0.17 (backend simulado)
- Google Fonts (Playfair Display, DM Sans, Space Mono)
- Render (hospedagem em nuvem)

## 4. Como Executar Localmente

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar o servidor (JSON Server + arquivos estáticos)
npm start

# 3. Acessar no navegador
# http://localhost:3001
```

> **Requisito:** Node.js 14+ instalado

## 5. Deploy — Site em produção

O projeto está hospedado no **Render** e pode ser acessado pelo link abaixo:

🔗 **https://vinylvault-cole-o-de-discos-cl-ssicos.onrender.com**

> No plano gratuito do Render, o servidor entra em modo de espera após 15 minutos sem acesso. O primeiro carregamento pode levar até 60 segundos.

### Como o deploy funciona

O Render detecta automaticamente novos commits na branch `main` e faz o redeploy. O JSON Server é configurado para escutar em `0.0.0.0` (necessário para ambientes de nuvem) e a porta é definida pela variável de ambiente `$PORT` injetada pelo Render:

```json
"start": "json-server --watch db/db.json --port $PORT --host 0.0.0.0 --static public"
```

O `app.js` usa `window.location.origin` como base da API, funcionando tanto localmente quanto em produção sem alteração de código:

```js
const API_BASE = window.location.origin;
```

## 6. Estrutura de Arquivos

```
VinylVault/
├── db/
│   └── db.json                  ← Banco de dados (discos e faixas)
├── public/
│   ├── index.html               ← Home-page
│   ├── detalhe.html             ← Página de detalhes do álbum
│   ├── cadastro_disco.html      ← Página de gerenciamento CRUD
│   └── assets/
│       ├── css/
│       │   ├── styles.css       ← Estilos globais
│       │   └── cadastro.css     ← Estilos da página de gerenciamento
│       └── js/
│           └── app.js           ← Lógica JS + chamadas Fetch
├── package.json
└── README.md
```

## 7. Endpoints da API (JSON Server)

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/discos` | Lista todos os discos |
| GET | `/discos?destaque=true` | Lista discos em destaque |
| GET | `/discos/:id` | Retorna um disco pelo ID |
| GET | `/faixas?discoId=:id` | Lista faixas de um disco |
| POST | `/discos` | Cadastra novo disco |
| PUT | `/discos/:id` | Atualiza disco existente |
| DELETE | `/discos/:id` | Remove disco |

## 8. Critérios Atendidos — Atividades Práticas

### Semanas 5 (HTML/CSS)
- Tags semânticas: `header`, `footer`, `main`, `nav`, `section`, `article`
- Atributos `class` nos elementos principais
- Formulário com 2+ campos e botão (busca no header)
- Imagens reais via Lorem Picsum
- Combinações de seletores CSS com hierarquia de componentes
- Propriedades CSS: `box-model` (margin/padding), `display`, `position`

### Semanas 9 e 10 (JavaScript + DOM)
- Bootstrap: carousel + grid cards responsivo
- JSON estruturado com entidade principal e secundária
- Montagem dinâmica via JavaScript + Fetch API
- Passagem de parâmetro por query string (`?id=`)
- Responsividade: mobile, tablet e desktop

### Trabalho Prático 1 (JSON Server)
- JSON Server como backend simulado com API RESTful
- Todas as páginas consomem dados via Fetch ao JSON Server
- Carousel de destaques e grid de cards montados dinamicamente
- Página de detalhes com 5+ informações e galeria de faixas
- Site responsivo com Bootstrap Grid e media queries

### Semanas 16 e 17 (CRUD)
- Página `cadastro_disco.html` com CRUD completo
- Formulário com validação client-side por campo
- Preview de imagem em tempo real
- Modo edição (PUT) ao clicar na tabela
- Modal de confirmação antes de excluir
- Toast de feedback após cada operação
- Filtro em tempo real na tabela
- Tabela responsiva com miniatura, nome, artista, ano e ações

## 9. Testes de API

Exemplos de requisições para testar com Postman, Insomnia ou Thunder Client.

**GET — listar todos**
```
GET http://localhost:3001/discos
```

**POST — criar novo disco**
```
POST http://localhost:3001/discos
Content-Type: application/json

{
  "nome": "Novo Álbum",
  "artista": "Novo Artista",
  "ano": 2024,
  "genero": "Indie",
  "gravadora": "Indie Records",
  "duracao": "38 min",
  "descricao": "Descrição do álbum.",
  "conteudo": "Texto completo sobre o álbum.",
  "imagemPrincipal": "https://picsum.photos/id/50/600/600",
  "destaque": false,
  "avaliacao": 4
}
```

**PUT — atualizar disco (id=1)**
```
PUT http://localhost:3001/discos/1
Content-Type: application/json

{
  "id": 1,
  "nome": "Kind of Blue (Editado)",
  "artista": "Miles Davis",
  "ano": 1959,
  "genero": "Jazz Modal",
  "avaliacao": 5,
  "destaque": true
}
```

**DELETE — excluir disco (id=1)**
```
DELETE http://localhost:3001/discos/1
```