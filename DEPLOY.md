# SchuleZap — Guia de Deploy no Coolify

Tudo pronto pra subir. São 3 serviços: **banco** (você já criou), **backend** (API Rails) e **frontend** (site React). Siga na ordem.

---

## Antes de começar

Você vai precisar de duas coisas geradas por você:

**1. Um SECRET_KEY_BASE** (chave que assina os logins). Gere uma bem longa e aleatória. Num terminal qualquer:
```bash
openssl rand -hex 64
```
Guarde o resultado.

**2. A DATABASE_URL do seu Postgres 18** (o que você já subiu). No Coolify, abra o serviço do Postgres → aba de conexão. Copie a **Internal Connection URL** (a que usa o nome do serviço como host, não `localhost`). Algo como:
```
postgres://usuario:senha@postgresql-abc123:5432/schulezap
```

---

## Passo 1 — Backend (API Rails)

1. No mesmo projeto onde está o Postgres, clique em **+ New Resource → Application**.
2. Fonte: o repositório `jacksontomelin/schulezap`.
3. **Base Directory / Build Context:** `/backend` (importante — o backend vive nessa subpasta).
4. Build Pack: **Dockerfile** (o Coolify detecta o `backend/Dockerfile`).
5. **Porta exposta:** `3000`.
6. Em **Environment Variables**, adicione:

   | Variável | Valor |
   |---|---|
   | `DATABASE_URL` | a URL interna que você copiou |
   | `SECRET_KEY_BASE` | a chave que você gerou |
   | `CORS_ORIGINS` | `https://schulezap.com.br` (o domínio do front) |
   | `RUN_SEEDS` | `true` (só na primeira subida — ver nota abaixo) |
   | `RAILS_ENV` | `production` |

7. Configure o domínio da API, ex.: `api.schulezap.com.br`.
8. **Deploy.**

O container roda as migrations sozinho ao subir (via `docker-entrypoint`). Com `RUN_SEEDS=true`, também cria os dados demo (escola, grupos, um admin e convites).

> **Depois do primeiro deploy dar certo, volte e mude `RUN_SEEDS` para `false`** e faça redeploy — assim os seeds não rodam de novo a cada reinício.

**Logins demo que os seeds criam:**
- Aluno: `Marco` / `123456`
- Responsável (admin): `DiretoraAna` / `admin123`

---

## Passo 2 — Frontend (site React)

1. **+ New Resource → Application**, mesmo repositório.
2. **Base Directory:** `/` (raiz).
3. Build Pack: **Dockerfile** (usa o `Dockerfile` da raiz).
4. **Porta exposta:** `80`.
5. Em **Build Variables / Build Args** (precisa ser em build-time, não runtime):

   | Variável | Valor |
   |---|---|
   | `REACT_APP_API_URL` | `https://api.schulezap.com.br/api/v1` |

6. Configure o domínio: `schulezap.com.br`.
7. **Deploy.**

---

## Passo 3 — Conferir

1. Abra `https://schulezap.com.br` → a landing carrega.
2. Clique em **Entrar** → tela de login.
3. Entre com `Marco` / `123456` (ou resgate um convite).
4. Poste algo, curta, entre num grupo. Se salvou e continua lá depois de recarregar, **o banco está funcionando de ponta a ponta**.
5. Entre como `DiretoraAna` / `admin123` pra ver a área de moderação.

---

## Notas

- **Postgres 18** usa autenticação `scram-sha-256`. O driver `pg` do Rails fala isso nativamente — sem configuração extra.
- Se a API der erro de conexão, é quase sempre a `DATABASE_URL` apontando pro host errado. Use o host **interno** do Coolify (nome do serviço), não `localhost`.
- Os três serviços precisam estar **no mesmo projeto** do Coolify pra se enxergarem pela rede interna.
- O front e o back conversam por HTTPS via os domínios públicos; o `CORS_ORIGINS` no backend precisa bater com o domínio do front.

---

## Rodar localmente (opcional, pra testar antes)

Com Docker instalado, na raiz do projeto:
```bash
cp backend/.env.example .env   # ajuste as senhas
docker compose up --build
```
- Front: http://localhost:8080
- API: http://localhost:3000

O `docker-compose.yml` sobe os três (banco + back + front) de uma vez.
