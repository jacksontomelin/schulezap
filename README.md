# SchuleZap 🏫

**Rede Social Escolar de Pomerode, SC — Nossa Pequena Alemanha.**

Criado por **Thiago Tomelin**.

---

## O que é

O SchuleZap é uma rede social fechada, feita especialmente para alunos da Escola Doutor Blumenau, em Pomerode, SC. Só entra quem tem convite — sem estranhos, sem risco.

**Funcionalidades:**
- 🏠 Mural da turma com posts, curtidas e reações
- 👥 Grupos por turma, time ou clube
- 🎮 Jogos e desafios (quiz, placar, palavra em alemão)
- 🏅 Medalhas e conquistas no perfil
- 🔒 Acesso só por código de convite

---

## Stack

- **Frontend:** React 18 + React Router v6
- **Estilo:** CSS puro com variáveis (sem Tailwind, sem framework)
- **Deploy:** Nginx (Alpine) via Docker multi-stage
- **Infra:** Coolify + Traefik (SSL automático)

---

## Rodar localmente

```bash
npm install
npm start
# Abre em http://localhost:3000
```

## Build de produção

```bash
npm run build
```

## Docker

```bash
docker build -t schulezap .
docker run -p 3000:80 schulezap
# Abre em http://localhost:3000
```

## Docker Compose (com Traefik/Coolify)

```bash
docker compose up -d
```

Edite o `docker-compose.yml` pra configurar seu domínio.

---

## Deploy no Coolify

1. Crie um novo app no Coolify e aponte pro repositório `jacksontomelin/schulezap`.
2. Coolify detecta o `Dockerfile` automaticamente.
3. Configure o domínio `schulezap.com.br` no painel — SSL via Let's Encrypt automático.
4. Dê Deploy. Pronto.

---

## Créditos

Desenvolvido com 💛 em Pomerode, SC.  
**Criado por Thiago Tomelin** — 2026.
