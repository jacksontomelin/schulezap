
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
