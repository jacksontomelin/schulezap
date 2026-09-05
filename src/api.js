const BASE = process.env.REACT_APP_API_URL || "http://localhost:3000/api/v1";

const TOKEN_KEY = "schulezap_token";

export function getToken() {
  return window.__sz_token || null;
}
export function setToken(t) {
  window.__sz_token = t; // em memória (artefato/preview não permite localStorage)
  try { sessionStorage.setItem(TOKEN_KEY, t); } catch (_) {}
}
export function clearToken() {
  window.__sz_token = null;
  try { sessionStorage.removeItem(TOKEN_KEY); } catch (_) {}
}
(function restore() {
  try {
    const t = sessionStorage.getItem(TOKEN_KEY);
    if (t) window.__sz_token = t;
  } catch (_) {}
})();

async function req(path, { method = "GET", body } = {}) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.erro || "Algo deu errado. Tente de novo.");
  return data;
}

export const api = {
  // auth
  entrar: (apelido, senha, escola_slug) =>
    req("/auth/entrar", { method: "POST", body: { apelido, senha, escola_slug } }),
  resgatar: (codigo, apelido, senha, nome_completo) =>
    req("/auth/resgatar", { method: "POST", body: { codigo, apelido, senha, nome_completo } }),
  eu: () => req("/auth/eu"),

  // feed
  feed: (opts = {}) => {
    const q = new URLSearchParams();
    if (opts.grupoId) q.set("grupo_id", opts.grupoId);
    if (opts.usuarioId) q.set("usuario_id", opts.usuarioId);
    if (opts.modo) q.set("modo", opts.modo);
    if (opts.soFotos) { q.set("so_fotos", "1"); if (opts.autorId) q.set("autor_id", opts.autorId); }
    const qs = q.toString();
    return req(qs ? `/feed?${qs}` : "/feed");
  },
  criarPost: (grupo_id, texto, imagem_url) => req("/posts", { method: "POST", body: { grupo_id, texto, imagem_url } }),
  removerPost: (id) => req(`/posts/${id}`, { method: "DELETE" }),
  reagir: (id, tipo) => req(`/posts/${id}/reagir`, { method: "POST", body: { tipo } }),
  salvar: (id) => req(`/posts/${id}/salvar`, { method: "POST" }),
  salvos: () => req("/salvos"),
  denunciar: (id, motivo) => req(`/posts/${id}/denunciar`, { method: "POST", body: { motivo } }),

  // comentarios
  comentarios: (postId) => req(`/posts/${postId}/comentarios`),
  comentar: (postId, texto, respondendo_id) => req(`/posts/${postId}/comentarios`, { method: "POST", body: { texto, respondendo_id } }),

  // grupos
  grupos: () => req("/grupos"),
  entrarGrupo: (id) => req(`/grupos/${id}/entrar`, { method: "POST" }),
  sairGrupo: (id) => req(`/grupos/${id}/sair`, { method: "POST" }),
  criarGrupo: (nome, icone, cor_tema) => req("/grupos", { method: "POST", body: { nome, icone, cor_tema } }),

  // stories
  stories: () => req("/stories"),
  criarStory: (imagem_url, texto, cor_fundo) => req("/stories", { method: "POST", body: { imagem_url, texto, cor_fundo } }),
  verStory: (id) => req(`/stories/${id}/visto`, { method: "POST" }),
  apagarStory: (id) => req(`/stories/${id}`, { method: "DELETE" }),

  // chat
  conversas: () => req("/conversas"),
  abrirConversa: (usuario_id) => req("/conversas", { method: "POST", body: { usuario_id } }),
  mensagens: (id) => req(`/conversas/${id}/mensagens`),
  enviarMensagem: (id, texto) => req(`/conversas/${id}/mensagens`, { method: "POST", body: { texto } }),

  // desafios, ranking, notificacoes
  desafioResultado: (desafio, acertos, total) =>
    req(`/desafios/${desafio}/resultado`, { method: "POST", body: { acertos, total } }),
  desafiosHoje: () => req("/desafios/hoje"),
  ranking: () => req("/ranking"),
  notificacoes: () => req("/notificacoes"),

  // perfil
  perfil: (id) => req(id ? `/perfil/${id}` : "/perfil"),
  seguir: (id) => req(`/usuarios/${id}/seguir`, { method: "POST" }),
  buscar: (q) => req(`/busca?q=${encodeURIComponent(q)}`),
  atualizarPerfil: (dados) => req("/perfil", { method: "PATCH", body: dados }),

  // admin
  admin: {
    painel: () => req("/admin/painel"),
    denuncias: () => req("/admin/denuncias"),
    resolverDenuncia: (id, acao) => req(`/admin/denuncias/${id}`, { method: "PATCH", body: { acao } }),
    convites: () => req("/admin/convites"),
    gerarConvites: (turma, quantidade) => req("/admin/convites", { method: "POST", body: { turma, quantidade } }),
  },
};
