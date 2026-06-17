# VinylVault — Coleção de Discos Clássicos

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

### Funcionalidades

- **Home-page** com carrossel de destaques, grid de cards com busca em tempo real, gráfico de barras por gênero (Chart.js) e seção do autor.
- **Página de detalhe** com informações completas do álbum (nome, artista, ano, gravadora, duração, gênero, avaliação e descrição), lista de faixas e botão de favorito.
- **Login e cadastro de usuários** com sessão persistida em `sessionStorage`.
- **Favoritos** — marcação nos cards e na página de detalhe, com persistência no JSON Server e página dedicada para o usuário logado.
- **Gerenciamento de discos (CRUD)** restrito a usuários administradores.
- Menu dinâmico que adapta links (Gerenciar, Favoritos, Login/Logout) conforme o status da sessão.
- Todos os dados obtidos por **requisições Fetch à API REST do JSON Server**.

## 3. Tecnologias Utilizadas

- HTML5 semântico
- CSS3 com variáveis e media queries
- JavaScript ES6+ (vanilla, sem frameworks)
- Bootstrap 5.3 (grid, carousel)
- Chart.js 4.4 (visualização avançada — gráfico de barras)
- JSON Server 0.17 (backend simulado)
- Google Fonts (Playfair Display, DM Sans, Space Mono)
- Render (hospedagem em nuvem)

## 4. Como Executar Localmente

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar o servidor (JSON Server + arquivos estáticos)
npm run dev

# 3. Acessar no navegador
# http://localhost:3001
```

> **Requisito:** Node.js 14+ instalado.

> **Windows:** o script `npm start` usa a variável `$PORT`, que não é expandida no PowerShell. Para desenvolvimento local, utilize `npm run dev`. O comando `npm start` é destinado ao deploy no Render (Linux).

### Usuários de teste

| Login | Senha | Perfil |
|---|---|---|
| `admin` | `123` | Administrador (acesso ao CRUD) |
| `user` | `123` | Usuário comum (favoritos) |
| `gabriel` | `123` | Usuário comum |

## 5. Deploy — Site em produção

O projeto está hospedado no **Render** e pode ser acessado pelo link abaixo:

**https://vinylvault-cole-o-de-discos-cl-ssicos.onrender.com**

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
│   └── db.json                  ← Banco de dados (discos, faixas, usuarios, favoritos)
├── public/
│   ├── index.html               ← Home-page
│   ├── detalhe.html             ← Página de detalhes do álbum
│   ├── cadastro_disco.html      ← Gerenciamento CRUD (admin)
│   ├── login.html               ← Login de usuário
│   ├── cadastro_usuario.html    ← Cadastro de novo usuário
│   ├── favoritos.html           ← Álbuns favoritos do usuário logado
│   └── assets/
│       ├── css/
│       │   ├── styles.css       ← Estilos globais
│       │   └── cadastro.css     ← Estilos da página de gerenciamento
│       └── js/
│           ├── app.js           ← Lógica principal + Fetch + favoritos + gráfico
│           └── auth.js          ← Autenticação, sessão e menu dinâmico
├── package.json
└── README.md
```

## 7. Endpoints da API (JSON Server)

### Discos

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/discos` | Lista todos os discos |
| GET | `/discos?destaque=true` | Lista discos em destaque |
| GET | `/discos/:id` | Retorna um disco pelo ID |
| POST | `/discos` | Cadastra novo disco |
| PUT | `/discos/:id` | Atualiza disco existente |
| DELETE | `/discos/:id` | Remove disco |

### Faixas

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/faixas?discoId=:id` | Lista faixas de um disco |

### Usuários

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/usuarios?login=:login&senha=:senha` | Autentica usuário |
| GET | `/usuarios?login=:login` | Verifica login existente |
| POST | `/usuarios` | Cadastra novo usuário |

### Favoritos

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/favoritos?usuarioId=:id` | Lista favoritos do usuário |
| POST | `/favoritos` | Adiciona favorito |
| DELETE | `/favoritos/:id` | Remove favorito |

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

### Trabalho Prático 2 (Solução completa)
- Visualização avançada: gráfico de barras com Chart.js (álbuns por gênero) na home-page
- Login e cadastro de usuários com sessão em `sessionStorage`
- Menu dinâmico: Favoritos visível para logados, Gerenciar visível para admins, Login/Logout
- Favoritos: ícone nos cards e detalhe (vazado/preenchido), persistência no JSON Server
- Página `favoritos.html` para listar álbuns favoritos do usuário logado
- CRUD de discos restrito a usuários com `admin: true`
- Responsividade mantida em todas as novas telas (login, favoritos, gráfico)

## 9. Testes de API

Exemplos de requisições para testar com Postman, Insomnia ou Thunder Client.

**GET — listar discos**
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

**GET — autenticar usuário**
```
GET http://localhost:3001/usuarios?login=admin&senha=123
```

**POST — cadastrar usuário**
```
POST http://localhost:3001/usuarios
Content-Type: application/json

{
  "id": "uuid-gerado",
  "login": "novouser",
  "senha": "123",
  "nome": "Novo Usuário",
  "email": "novo@email.com",
  "admin": false
}
```

**POST — adicionar favorito**
```
POST http://localhost:3001/favoritos
Content-Type: application/json

{
  "usuarioId": "ec37c83d-4b7f-458d-9e10-3fda7d37cd3e",
  "discoId": 2
}
```

**GET — listar favoritos do usuário**
```
GET http://localhost:3001/favoritos?usuarioId=ec37c83d-4b7f-458d-9e10-3fda7d37cd3e
```

**DELETE — remover favorito**
```
DELETE http://localhost:3001/favoritos/1
```

**PUT — atualizar disco**
```
PUT http://localhost:3001/discos/2
Content-Type: application/json

{
  "id": 2,
  "nome": "Rumours (Editado)",
  "artista": "Fleetwood Mac",
  "ano": 1977,
  "genero": "Rock Clássico",
  "avaliacao": 5,
  "destaque": true
}
```

**DELETE — excluir disco**
```
DELETE http://localhost:3001/discos/9
```
