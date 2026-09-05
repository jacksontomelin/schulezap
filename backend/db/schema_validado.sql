
CREATE TABLE escolas (
  id BIGSERIAL PRIMARY KEY,
  nome VARCHAR NOT NULL,
  cidade VARCHAR NOT NULL DEFAULT 'Pomerode',
  uf VARCHAR(2) NOT NULL DEFAULT 'SC',
  slug VARCHAR NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX idx_escolas_slug ON escolas(slug);

CREATE TABLE usuarios (
  id BIGSERIAL PRIMARY KEY,
  escola_id BIGINT NOT NULL REFERENCES escolas(id),
  apelido VARCHAR NOT NULL,
  nome_completo VARCHAR,
  email VARCHAR,
  senha_digest VARCHAR NOT NULL,
  papel INTEGER NOT NULL DEFAULT 0,
  avatar_inicial VARCHAR(1),
  avatar_cor VARCHAR DEFAULT '#C62828',
  status_icone VARCHAR DEFAULT 'gamepad',
  ultimo_acesso_em TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX idx_usuarios_escola_apelido ON usuarios(escola_id, apelido);
CREATE UNIQUE INDEX idx_usuarios_email ON usuarios(email) WHERE email IS NOT NULL;
CREATE INDEX idx_usuarios_papel ON usuarios(papel);

CREATE TABLE convites (
  id BIGSERIAL PRIMARY KEY,
  escola_id BIGINT NOT NULL REFERENCES escolas(id),
  gerado_por_id BIGINT REFERENCES usuarios(id),
  codigo VARCHAR NOT NULL,
  turma_sugerida VARCHAR,
  usado_por_id BIGINT REFERENCES usuarios(id),
  usado_em TIMESTAMP,
  expira_em TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX idx_convites_codigo ON convites(codigo);

CREATE TABLE grupos (
  id BIGSERIAL PRIMARY KEY,
  escola_id BIGINT NOT NULL REFERENCES escolas(id),
  criado_por_id BIGINT REFERENCES usuarios(id),
  nome VARCHAR NOT NULL,
  icone VARCHAR DEFAULT 'users',
  cor_tema VARCHAR DEFAULT 'red',
  descricao TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX idx_grupos_escola_nome ON grupos(escola_id, nome);

CREATE TABLE membros_grupo (
  id BIGSERIAL PRIMARY KEY,
  grupo_id BIGINT NOT NULL REFERENCES grupos(id),
  usuario_id BIGINT NOT NULL REFERENCES usuarios(id),
  papel_no_grupo INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX idx_membros_grupo_uniq ON membros_grupo(grupo_id, usuario_id);

CREATE TABLE posts (
  id BIGSERIAL PRIMARY KEY,
  usuario_id BIGINT NOT NULL REFERENCES usuarios(id),
  grupo_id BIGINT NOT NULL REFERENCES grupos(id),
  texto TEXT NOT NULL,
  oculto BOOLEAN NOT NULL DEFAULT false,
  ocultado_por_id BIGINT REFERENCES usuarios(id),
  reacoes_count INTEGER NOT NULL DEFAULT 0,
  comentarios_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);
CREATE INDEX idx_posts_grupo_created ON posts(grupo_id, created_at);

CREATE TABLE comentarios (
  id BIGSERIAL PRIMARY KEY,
  post_id BIGINT NOT NULL REFERENCES posts(id),
  usuario_id BIGINT NOT NULL REFERENCES usuarios(id),
  texto TEXT NOT NULL,
  oculto BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);
CREATE INDEX idx_comentarios_post_created ON comentarios(post_id, created_at);

CREATE TABLE reacoes (
  id BIGSERIAL PRIMARY KEY,
  post_id BIGINT NOT NULL REFERENCES posts(id),
  usuario_id BIGINT NOT NULL REFERENCES usuarios(id),
  tipo VARCHAR NOT NULL DEFAULT 'curtida',
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX idx_reacoes_uniq ON reacoes(post_id, usuario_id);

CREATE TABLE medalhas (
  id BIGSERIAL PRIMARY KEY,
  usuario_id BIGINT NOT NULL REFERENCES usuarios(id),
  chave VARCHAR NOT NULL,
  titulo VARCHAR NOT NULL,
  icone VARCHAR DEFAULT 'medal',
  conquistada_em TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX idx_medalhas_uniq ON medalhas(usuario_id, chave);

CREATE TABLE denuncias (
  id BIGSERIAL PRIMARY KEY,
  post_id BIGINT NOT NULL REFERENCES posts(id),
  denunciado_por_id BIGINT NOT NULL REFERENCES usuarios(id),
  motivo VARCHAR,
  status INTEGER NOT NULL DEFAULT 0,
  resolvida_por_id BIGINT REFERENCES usuarios(id),
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);
CREATE INDEX idx_denuncias_status ON denuncias(status);

-- migration 7: pontos + desafios
ALTER TABLE usuarios ADD COLUMN pontos INTEGER NOT NULL DEFAULT 0;
CREATE INDEX idx_usuarios_escola_pontos ON usuarios(escola_id, pontos);

CREATE TABLE resultados_desafio (
  id BIGSERIAL PRIMARY KEY,
  usuario_id BIGINT NOT NULL REFERENCES usuarios(id),
  desafio VARCHAR NOT NULL,
  acertos INTEGER NOT NULL DEFAULT 0,
  total INTEGER NOT NULL DEFAULT 0,
  pontos_ganhos INTEGER NOT NULL DEFAULT 0,
  dia DATE NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX idx_resultados_desafio_uniq ON resultados_desafio(usuario_id, desafio, dia);

-- migration 8: social
ALTER TABLE posts ADD COLUMN imagem_url TEXT;
ALTER TABLE usuarios ADD COLUMN bio VARCHAR(160);
ALTER TABLE usuarios ADD COLUMN capa_cor VARCHAR DEFAULT '#F7B500';
ALTER TABLE comentarios ADD COLUMN respondendo_id BIGINT REFERENCES comentarios(id);

CREATE TABLE amizades (
  id BIGSERIAL PRIMARY KEY,
  seguidor_id BIGINT NOT NULL REFERENCES usuarios(id),
  seguido_id BIGINT NOT NULL REFERENCES usuarios(id),
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX idx_amizades_uniq ON amizades(seguidor_id, seguido_id);

CREATE TABLE salvamentos (
  id BIGSERIAL PRIMARY KEY,
  usuario_id BIGINT NOT NULL REFERENCES usuarios(id),
  post_id BIGINT NOT NULL REFERENCES posts(id),
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX idx_salvamentos_uniq ON salvamentos(usuario_id, post_id);

-- migration 9: chat
CREATE TABLE conversas (
  id BIGSERIAL PRIMARY KEY,
  usuario_a_id BIGINT NOT NULL REFERENCES usuarios(id),
  usuario_b_id BIGINT NOT NULL REFERENCES usuarios(id),
  ultima_mensagem_em TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX idx_conversas_par ON conversas(usuario_a_id, usuario_b_id);

CREATE TABLE mensagens (
  id BIGSERIAL PRIMARY KEY,
  conversa_id BIGINT NOT NULL REFERENCES conversas(id),
  remetente_id BIGINT NOT NULL REFERENCES usuarios(id),
  texto TEXT NOT NULL,
  lida_em TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);
CREATE INDEX idx_mensagens_conversa ON mensagens(conversa_id, created_at);

-- migration 10: stories
CREATE TABLE stories (
  id BIGSERIAL PRIMARY KEY,
  usuario_id BIGINT NOT NULL REFERENCES usuarios(id),
  imagem_url TEXT,
  texto VARCHAR(120),
  cor_fundo VARCHAR DEFAULT '#F7B500',
  expira_em TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);
CREATE INDEX idx_stories_usuario_expira ON stories(usuario_id, expira_em);

CREATE TABLE visualizacoes_story (
  id BIGSERIAL PRIMARY KEY,
  story_id BIGINT NOT NULL REFERENCES stories(id),
  usuario_id BIGINT NOT NULL REFERENCES usuarios(id),
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX idx_visualizacoes_story_uniq ON visualizacoes_story(story_id, usuario_id);

-- migration 11: social completo
ALTER TABLE usuarios ADD COLUMN foto_url TEXT;
ALTER TABLE usuarios ADD COLUMN capa_url TEXT;
ALTER TABLE posts ADD COLUMN imagens TEXT;
ALTER TABLE posts ADD COLUMN editado_em TIMESTAMP;
ALTER TABLE mensagens ADD COLUMN imagem_url TEXT;

CREATE TABLE enquetes (
  id BIGSERIAL PRIMARY KEY, post_id BIGINT NOT NULL REFERENCES posts(id),
  pergunta VARCHAR NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT now(), updated_at TIMESTAMP NOT NULL DEFAULT now());
CREATE TABLE opcoes_enquete (
  id BIGSERIAL PRIMARY KEY, enquete_id BIGINT NOT NULL REFERENCES enquetes(id),
  texto VARCHAR NOT NULL, ordem INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT now(), updated_at TIMESTAMP NOT NULL DEFAULT now());
CREATE TABLE votos_enquete (
  id BIGSERIAL PRIMARY KEY, opcao_id BIGINT NOT NULL REFERENCES opcoes_enquete(id),
  usuario_id BIGINT NOT NULL REFERENCES usuarios(id), enquete_id BIGINT NOT NULL REFERENCES enquetes(id),
  created_at TIMESTAMP NOT NULL DEFAULT now(), updated_at TIMESTAMP NOT NULL DEFAULT now());
CREATE UNIQUE INDEX idx_votos_uniq ON votos_enquete(enquete_id, usuario_id);

CREATE TABLE mencoes (
  id BIGSERIAL PRIMARY KEY, usuario_id BIGINT NOT NULL REFERENCES usuarios(id),
  autor_id BIGINT NOT NULL REFERENCES usuarios(id),
  post_id BIGINT REFERENCES posts(id), comentario_id BIGINT REFERENCES comentarios(id),
  created_at TIMESTAMP NOT NULL DEFAULT now(), updated_at TIMESTAMP NOT NULL DEFAULT now());
CREATE INDEX idx_mencoes_usuario ON mencoes(usuario_id, created_at);

CREATE TABLE hashtags (
  id BIGSERIAL PRIMARY KEY, nome VARCHAR NOT NULL, usos INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT now(), updated_at TIMESTAMP NOT NULL DEFAULT now());
CREATE UNIQUE INDEX idx_hashtags_nome ON hashtags(nome);
CREATE TABLE hashtags_posts (
  id BIGSERIAL PRIMARY KEY, hashtag_id BIGINT NOT NULL REFERENCES hashtags(id),
  post_id BIGINT NOT NULL REFERENCES posts(id));
CREATE UNIQUE INDEX idx_hashtags_posts_uniq ON hashtags_posts(hashtag_id, post_id);

-- migration 12: escola (avisos, notas, agenda)
ALTER TABLE usuarios ADD COLUMN turma VARCHAR(20);
ALTER TABLE usuarios ADD COLUMN periodo VARCHAR(20);

CREATE TABLE avisos (
  id BIGSERIAL PRIMARY KEY, escola_id BIGINT NOT NULL REFERENCES escolas(id),
  autor_id BIGINT NOT NULL REFERENCES usuarios(id),
  titulo VARCHAR NOT NULL, corpo TEXT NOT NULL, categoria VARCHAR DEFAULT 'geral',
  turma_alvo VARCHAR, fixado BOOLEAN NOT NULL DEFAULT false, evento_em TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT now(), updated_at TIMESTAMP NOT NULL DEFAULT now());
CREATE INDEX idx_avisos_escola ON avisos(escola_id, created_at);

CREATE TABLE leituras_aviso (
  id BIGSERIAL PRIMARY KEY, aviso_id BIGINT NOT NULL REFERENCES avisos(id),
  usuario_id BIGINT NOT NULL REFERENCES usuarios(id),
  created_at TIMESTAMP NOT NULL DEFAULT now(), updated_at TIMESTAMP NOT NULL DEFAULT now());
CREATE UNIQUE INDEX idx_leituras_uniq ON leituras_aviso(aviso_id, usuario_id);

CREATE TABLE disciplinas (
  id BIGSERIAL PRIMARY KEY, escola_id BIGINT NOT NULL REFERENCES escolas(id),
  nome VARCHAR NOT NULL, icone VARCHAR DEFAULT 'book',
  created_at TIMESTAMP NOT NULL DEFAULT now(), updated_at TIMESTAMP NOT NULL DEFAULT now());
CREATE UNIQUE INDEX idx_disciplinas_uniq ON disciplinas(escola_id, nome);

CREATE TABLE notas (
  id BIGSERIAL PRIMARY KEY, usuario_id BIGINT NOT NULL REFERENCES usuarios(id),
  disciplina_id BIGINT NOT NULL REFERENCES disciplinas(id),
  lancada_por_id BIGINT REFERENCES usuarios(id),
  valor DECIMAL(4,2) NOT NULL, bimestre INTEGER NOT NULL DEFAULT 1, ano_letivo VARCHAR NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT now(), updated_at TIMESTAMP NOT NULL DEFAULT now());
CREATE UNIQUE INDEX idx_notas_uniq ON notas(usuario_id, disciplina_id, bimestre, ano_letivo);

CREATE TABLE agendas (
  id BIGSERIAL PRIMARY KEY, escola_id BIGINT NOT NULL REFERENCES escolas(id),
  disciplina_id BIGINT REFERENCES disciplinas(id),
  titulo VARCHAR NOT NULL, descricao TEXT, turma_alvo VARCHAR,
  tipo VARCHAR DEFAULT 'tarefa', data DATE NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT now(), updated_at TIMESTAMP NOT NULL DEFAULT now());
CREATE INDEX idx_agendas_data ON agendas(escola_id, data);
