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
  feed: (grupoId) => req(grupoId ? `/feed?grupo_id=${grupoId}` : "/feed"),
  criarPost: (grupo_id, texto) => req("/posts", { method: "POST", body: { grupo_id, texto } }),
  removerPost: (id) => req(`/posts/${id}`, { method: "DELETE" }),
  reagir: (id) => req(`/posts/${id}/reagir`, { method: "POST" }),
  denunciar: (id, motivo) => req(`/posts/${id}/denunciar`, { method: "POST", body: { motivo } }),

  // comentarios
  comentarios: (postId) => req(`/posts/${postId}/comentarios`),
  comentar: (postId, texto) => req(`/posts/${postId}/comentarios`, { method: "POST", body: { texto } }),

  // grupos
  grupos: () => req("/grupos"),
  entrarGrupo: (id) => req(`/grupos/${id}/entrar`, { method: "POST" }),
  sairGrupo: (id) => req(`/grupos/${id}/sair`, { method: "POST" }),
  criarGrupo: (nome, icone, cor_tema) => req("/grupos", { method: "POST", body: { nome, icone, cor_tema } }),

  // perfil
  perfil: (id) => req(id ? `/perfil/${id}` : "/perfil"),
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
