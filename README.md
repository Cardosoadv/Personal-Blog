# Personal Blog

Blog pessoal full-stack com backend em **Express** e frontend em **Vue 3**. Permite
criar postagens com imagem, receber comentários e filtrar postagens por hashtag.

## Funcionalidades

- Criar postagens com título, conteúdo e imagem (upload).
- Extração automática de hashtags (`#exemplo`) do título/conteúdo.
- Filtrar postagens por hashtag (nuvem de hashtags com contagem) e por busca textual.
- Comentar em postagens.
- Excluir postagens.

## Estrutura

```
server/   API REST em Express + SQLite (better-sqlite3)
client/   SPA em Vue 3 + Vite
```

## Como rodar

### 1. Backend (porta 3000)

```bash
cd server
npm install
npm run dev    # ou: npm start
```

O banco SQLite é criado automaticamente em `server/data/blog.sqlite` e as imagens
enviadas ficam em `server/uploads/`.

### 2. Frontend (porta 5173)

Em outro terminal:

```bash
cd client
npm install
npm run dev
```

Acesse `http://localhost:5173`. O Vite já está configurado para fazer proxy de
`/api` e `/uploads` para `http://localhost:3000`.

### Build de produção do frontend

```bash
cd client
npm run build
```

Os arquivos estáticos são gerados em `client/dist`.

## API

| Método | Rota                     | Descrição                              |
|--------|--------------------------|-----------------------------------------|
| GET    | `/api/posts`             | Lista postagens (`?hashtag=`, `?search=`) |
| GET    | `/api/posts/:id`         | Detalhe de uma postagem                 |
| POST   | `/api/posts`              | Cria postagem (`multipart/form-data`: `title`, `content`, `image`) |
| DELETE | `/api/posts/:id`         | Remove uma postagem                     |
| GET    | `/api/posts/:id/comments`| Lista comentários da postagem           |
| POST   | `/api/posts/:id/comments`| Cria comentário (`author`, `content`)   |
| GET    | `/api/hashtags`          | Lista hashtags com contagem de uso      |

## Stack

- **Backend:** Express, better-sqlite3, multer (upload de imagens), cors
- **Frontend:** Vue 3 (`<script setup>`), Vue Router, Axios, Vite
