# Banco de dados — SchuleZap

PostgreSQL. Modelagem validada com dados reais (ver testes abaixo).

## Tabelas

| Tabela | Papel |
|---|---|
| `escolas` | Cada escola é um espaço isolado |
| `usuarios` | Aluno, responsável ou admin (campo `papel`) |
| `convites` | Código de acesso único; um uso só |
| `grupos` / `membros_grupo` | Cantinhos por turma/time/clube |
| `posts` / `comentarios` / `reacoes` | O mural |
| `medalhas` | Conquistas do perfil |
| `denuncias` | Moderação (botão de denúncia) |

## Regras garantidas pelo próprio banco

- Apelido único **por escola** (o mesmo apelido pode existir em escolas diferentes)
- Código de convite único e resgatável uma só vez
- Um usuário reage **uma vez** por post (sem curtida em dobro)
- Não dá pra apagar uma escola que ainda tem alunos (protege dados)

## Como aplicar

Com o Rails configurado e a `DATABASE_URL` apontando pro Postgres do Coolify:

```bash
bin/rails db:create db:migrate db:seed
```

O arquivo `schema_validado.sql` é a referência do schema aplicado e testado
(não é usado pelo Rails, serve de documentação).
