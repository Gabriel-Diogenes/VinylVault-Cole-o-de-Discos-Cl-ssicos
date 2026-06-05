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

- A **home-page** exibe os álbuns em destaque via carrossel e todos os álbuns em um grid de cards dinâmico, com busca em tempo real.
- A **página de detalhe** apresenta as informações completas de um álbum (nome, artista, ano, gravadora, duração, gênero, avaliação e descrição) e lista todas as suas faixas com imagem, número, título, duração e descrição.
- Todos os dados são obtidos por **requisições Fetch à API REST do JSON Server**.

## 3. Tecnologias Utilizadas

- HTML5 semântico
- CSS3 com variáveis e media queries
- JavaScript ES6+ (vanilla, sem frameworks)
- Bootstrap 5.3 (grid, carousel)
- JSON Server 0.17 (backend simulado)
- Google Fonts (Playfair Display, DM Sans, Space Mono)

## 4. Como Executar

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar o servidor (JSON Server + arquivos estáticos na porta 3000)
npm start

# 3. Acessar no navegador
# http://localhost:3000
```

> **Requisito:** Node.js 14+ instalado

## 5. Estrutura de Arquivos

```
vinylvault/
├── db/
│   └── db.json              ← Banco de dados (discos e faixas)
├── public/
│   ├── index.html           ← Home-page
│   ├── detalhe.html         ← Página de detalhes do álbum
│   └── assets/
│       ├── css/
│       │   └── styles.css   ← Estilos customizados
│       └── js/
│           └── app.js       ← Lógica JS + chamadas Fetch
├── package.json
└── README.md
```

## 6. Endpoints da API (JSON Server)

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/discos` | Lista todos os discos |
| GET | `/discos?destaque=true` | Lista discos em destaque |
| GET | `/discos/:id` | Retorna um disco pelo ID |
| GET | `/faixas?discoId=:id` | Lista faixas de um disco |

## 7. Critérios Atendidos

- HTML semântico: `header`, `footer`, `main`, `nav`, `section`, `article`
- Atributos `class` nos elementos principais
- Formulário com 2+ campos e botão (busca no header)
- Imagens reais via Lorem Picsum
- Combinações de seletores CSS (hierarquia de componentes)
- Propriedades CSS: `box-model` (margin/padding), `display`, `position`
- Bootstrap: carousel + grid cards responsivo
- JSON estruturado com entidade principal e secundária
- Montagem dinâmica via JavaScript + Fetch API
- Passagem de parâmetro por query string (`?id=`)
- Responsividade: mobile, tablet e desktop
- JSON Server como backend simulado

---

## 8. CRUD — Semanas 16 e 17

### Página adicionada: `cadastro_disco.html`

Página completa de gerenciamento com as quatro operações do CRUD:

| Operação | Método HTTP | Endpoint |
|---|---|---|
| **Read** — listar todos os discos | `GET` | `/discos` |
| **Create** — cadastrar novo disco | `POST` | `/discos` |
| **Update** — editar disco existente | `PUT` | `/discos/:id` |
| **Delete** — excluir disco | `DELETE` | `/discos/:id` |

### Funcionalidades implementadas

- Formulário com **validação client-side** (campos obrigatórios, ano válido, feedback visual por campo)
- **Preview da imagem** em tempo real ao digitar a URL
- **Modo edição**: ao clicar em ✏️ na tabela, o formulário é preenchido e muda para modo PUT
- **Modal de confirmação** antes de excluir (evita exclusão acidental)
- **Toast de feedback** (sucesso / erro / info) após cada operação
- **Filtro em tempo real** na tabela de discos cadastrados
- **Tabela responsiva** com miniatura, nome, artista, ano e ações
- Botão 👁 leva direto para a página de detalhe do disco

### Testes de API (Postman / Thunder Client)

Exemplos de requisições para testar:

**GET — listar todos**
```
GET http://localhost:3001/discos
```

**GET — buscar por ID**
```
GET http://localhost:3001/discos/1
```

**POST — criar novo disco**
```
POST http://localhost:3001/discos
Content-Type: application/json

{
  "nome": "Nouveau Album",
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

### Estrutura de arquivos atualizada

```
vinylvault/
├── db/
│   └── db.json
├── public/
│   ├── index.html
│   ├── detalhe.html
│   ├── cadastro_disco.html      
│   └── assets/
│       ├── css/
│       │   ├── styles.css
│       │   └── cadastro.css     
│       └── js/
│           └── app.js           
├── package.json
└── README.md
```
