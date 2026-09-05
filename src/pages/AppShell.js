import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icons';
import { Avatar, Tile, Pill, Wordmark } from '../components/UI';
import { api, setToken, clearToken, getToken } from '../api';
import './AppShell.css';

const API_ATIVA = Boolean(process.env.REACT_APP_API_URL);

/* ===================== dados demo (sem backend) ===================== */
const DEMO_POSTS = [
  { id: 3, autor: { id: 12, avatar_inicial: 'B', apelido: 'Bel' }, grupo: { nome: 'Grupo do Futebol' }, tempo: '20 min', texto: 'Quem acertar o placar do jogo de sábado leva a figurinha rara. Comenta aí.', reacoes: 12, eu_reagi: false, comentarios: 2, badge: 'craque' },
  { id: 2, autor: { id: 13, avatar_inicial: 'L', apelido: 'Lucas' }, grupo: { nome: 'Turma 6ºB' }, tempo: '5 min', texto: 'Servidor novo no ar. Quem tá dentro hoje depois da aula?', reacoes: 8, eu_reagi: false, comentarios: 0, photo: true },
  { id: 1, autor: { id: 14, avatar_inicial: 'T', apelido: 'Théo' }, grupo: { nome: 'Clube de Alemão' }, tempo: '1 h', texto: 'Descobri que "Freunde" é amigos em alemão. Combina com a gente.', reacoes: 5, eu_reagi: false, comentarios: 0 },
];
const DEMO_COMENTARIOS = { 3: [{ id: 1, autor: { avatar_inicial: 'M', apelido: 'Marco' }, texto: '2 a 1 pro nosso time!' }, { id: 2, autor: { avatar_inicial: 'L', apelido: 'Lucas' }, texto: 'Vou de 3 a 0.' }] };
const DEMO_GROUPS = [
  { id: 1, nome: 'Turma 6ºB', icone: 'school', membros: 24, participando: true },
  { id: 2, nome: 'Grupo do Futebol', icone: 'ball', membros: 18, participando: true },
  { id: 3, nome: 'Cantinho dos Games', icone: 'gamepad', membros: 31, participando: false },
  { id: 4, nome: 'Clube de Alemão', icone: 'language', membros: 12, participando: false },
  { id: 5, nome: 'Desenho e Arte', icone: 'palette', membros: 15, participando: false },
];
const DEMO_RANKING = { minha_posicao: 3, meus_pontos: 80, top: [
  { posicao: 1, usuario: { avatar_inicial: 'B', apelido: 'Bel' }, pontos: 140 },
  { posicao: 2, usuario: { avatar_inicial: 'L', apelido: 'Lucas' }, pontos: 110 },
  { posicao: 3, usuario: { avatar_inicial: 'M', apelido: 'Marco' }, pontos: 80, eu: true },
  { posicao: 4, usuario: { avatar_inicial: 'T', apelido: 'Théo' }, pontos: 60 },
  { posicao: 5, usuario: { avatar_inicial: 'H', apelido: 'Helena' }, pontos: 40 },
] };
const DEMO_NOTIFS = [
  { tipo: 'curtida', quem: { avatar_inicial: 'B', apelido: 'Bel' }, texto: 'Testando o mural novo!', tempo: '2 min' },
  { tipo: 'comentario', quem: { avatar_inicial: 'L', apelido: 'Lucas' }, texto: 'Boa, tô dentro!', tempo: '10 min' },
  { tipo: 'medalha', titulo: 'Quiz perfeito', icone: 'trophy', tempo: '1 h' },
];
const TONE_POR_ICONE = { school: 'red', ball: 'blue', gamepad: 'green', language: 'gold', palette: 'red', users: 'red', book: 'blue', rocket: 'gold', star: 'gold' };
const ICONES_GRUPO = ['users', 'school', 'ball', 'gamepad', 'language', 'palette', 'book', 'rocket', 'star'];

/* ===================== conteúdo dos jogos ===================== */
const QUIZ = [
  { q: 'Pomerode é conhecida como a cidade mais ___ do Brasil.', a: ['Alemã', 'Italiana', 'Fria'], correct: 0 },
  { q: 'Como se diz "amigos" em alemão?', a: ['Kinder', 'Freunde', 'Schule'], correct: 1 },
  { q: '"Schule" significa o quê?', a: ['Casa', 'Escola', 'Festa'], correct: 1 },
  { q: 'As casas típicas de Pomerode são no estilo:', a: ['Enxaimel', 'Colonial', 'Moderno'], correct: 0 },
];
const PALAVRAS = [
  { de: 'Freunde', pt: 'Amigos', opts: ['Amigos', 'Família', 'Vizinhos'] },
  { de: 'Schule', pt: 'Escola', opts: ['Loja', 'Escola', 'Igreja'] },
  { de: 'Haus', pt: 'Casa', opts: ['Casa', 'Carro', 'Rua'] },
  { de: 'Fußball', pt: 'Futebol', opts: ['Basquete', 'Vôlei', 'Futebol'] },
  { de: 'Apfel', pt: 'Maçã', opts: ['Banana', 'Maçã', 'Uva'] },
  { de: 'Hund', pt: 'Cachorro', opts: ['Gato', 'Cachorro', 'Pássaro'] },
  { de: 'Wasser', pt: 'Água', opts: ['Água', 'Leite', 'Suco'] },
];
const TEMAS_DESENHO = ['Uma casa enxaimel', 'Seu animal favorito', 'O time da escola', 'Um robô amigo', 'A rua da sua casa', 'Um super-herói de Pomerode', 'O que você comeu no almoço'];
const STATUS = ['gamepad', 'ball', 'rocket', 'palette', 'book', 'flame', 'star', 'language'];

const REACOES = [
  { tipo: 'curtida', emoji: '👍', label: 'Curti' },
  { tipo: 'amei', emoji: '❤️', label: 'Amei' },
  { tipo: 'risada', emoji: '😂', label: 'Haha' },
  { tipo: 'uau', emoji: '😮', label: 'Uau' },
  { tipo: 'triste', emoji: '😢', label: 'Triste' },
];
const emojiDe = (tipo) => (REACOES.find((r) => r.tipo === tipo) || REACOES[0]).emoji;

const diaDoAno = () => Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
const palavrasDeHoje = () => { const d = diaDoAno(); return [0, 1, 2].map((i) => PALAVRAS[(d + i) % PALAVRAS.length]); };
const temaDeHoje = () => TEMAS_DESENHO[diaDoAno() % TEMAS_DESENHO.length];

/* ===================================================================== */
export default function AppShell() {
  const nav = useNavigate();
  const [screen, setScreen] = useState('login');
  const [usuario, setUsuario] = useState(null);
  const [tab, setTab] = useState('feed');
  const [toast, setToast] = useState(null);
  const [painel, setPainel] = useState(null); // 'notif' | 'busca' | null
  const [postarTema, setPostarTema] = useState('');
  const [perfilId, setPerfilId] = useState(null); // ver perfil de outro usuário

  const showToast = useCallback((t) => { setToast(t); setTimeout(() => setToast(null), 2000); }, []);
  const abrirPerfil = useCallback((id) => { setPerfilId(id); setTab('perfil-outro'); setPainel(null); }, []);

  useEffect(() => {
    if (API_ATIVA && getToken()) {
      api.eu().then((u) => { setUsuario(u); setScreen('app'); }).catch(() => clearToken());
    }
  }, []);

  const entrou = (u) => { setUsuario(u); setScreen('app'); setTab('feed'); };
  const sair = () => { clearToken(); setUsuario(null); setScreen('login'); };
  const irPostar = (texto) => { setPostarTema(texto); setTab('feed'); };

  if (screen === 'login') return <Login onEntrar={entrou} onBack={() => nav('/')} toast={toast} />;

  const ehModerador = usuario && (usuario.papel === 'responsavel' || usuario.papel === 'admin');

  return (
    <div className="app-bg">
      <div className="app">
        <header className="app-top">
          <div className="app-top-brand">
            <img src="/logo.png" alt="" className="app-top-logo" />
            <Wordmark size={21} />
          </div>
          <div className="app-top-icons">
            <button className={`app-icon-btn ${painel === 'busca' ? 'is-on' : ''}`} aria-label="Buscar" onClick={() => setPainel(painel === 'busca' ? null : 'busca')}>
              <Icon name="search" size={22} />
            </button>
            <button className={`app-icon-btn ${painel === 'notif' ? 'is-on' : ''}`} aria-label="Notificações" onClick={() => setPainel(painel === 'notif' ? null : 'notif')}>
              <Icon name="bell" size={22} /><span className="app-dot" />
            </button>
            <button className="app-icon-btn" aria-label="Ranking" onClick={() => setTab('ranking')}><Icon name="trophy" size={22} /></button>
          </div>
        </header>

        <div className="app-body">
          <nav className="app-nav">
            {[
              ['feed', 'home', 'Mural'],
              ['grupos', 'users', 'Grupos'],
              ['jogos', 'gamepad', 'Desafios'],
              ['ranking', 'trophy', 'Ranking'],
              ...(ehModerador ? [['moderar', 'shield', 'Moderar']] : []),
              ['perfil', 'user', 'Perfil'],
            ].map(([id, ic, lb]) => (
              <button key={id} onClick={() => { setTab(id); setPainel(null); }} className={`app-nav-btn ${tab === id ? 'is-active' : ''}`}>
                <Icon name={ic} size={22} stroke={tab === id ? 2.5 : 2} />
                <span>{lb}</span>
              </button>
            ))}
          </nav>

          <main className="app-screen">
            {painel === 'notif' && <Notificacoes fechar={() => setPainel(null)} />}
            {painel === 'busca' && <Busca abrirPerfil={abrirPerfil} irGrupos={() => { setTab('grupos'); setPainel(null); }} fechar={() => setPainel(null)} />}
            {tab === 'feed' && <Feed usuario={usuario} showToast={showToast} temaInicial={postarTema} limparTema={() => setPostarTema('')} abrirPerfil={abrirPerfil} />}
            {tab === 'grupos' && <Grupos showToast={showToast} />}
            {tab === 'jogos' && <Jogos showToast={showToast} usuario={usuario} setUsuario={setUsuario} irPostar={irPostar} />}
            {tab === 'ranking' && <Ranking usuario={usuario} abrirPerfil={abrirPerfil} />}
            {tab === 'perfil' && <Perfil usuario={usuario} setUsuario={setUsuario} onLogout={sair} showToast={showToast} />}
            {tab === 'perfil-outro' && <PerfilOutro id={perfilId} usuario={usuario} showToast={showToast} voltar={() => setTab('feed')} />}
            {tab === 'moderar' && ehModerador && <Moderar showToast={showToast} />}
          </main>
        </div>

        {toast && <div className="app-toast"><Icon name="check" size={16} stroke={3} />{toast}</div>}
      </div>
    </div>
  );
}

/* ===================== LOGIN ===================== */
function Login({ onEntrar, onBack, toast }) {
  const [modo, setModo] = useState('entrar');
  const [apelido, setApelido] = useState('');
  const [senha, setSenha] = useState('');
  const [codigo, setCodigo] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  const submit = async (e) => {
    e.preventDefault(); setErro('');
    if (!API_ATIVA) {
      const ehAdmin = apelido.toLowerCase() === 'diretoraana';
      onEntrar({ id: 1, apelido: apelido || 'Marco', avatar_inicial: (apelido || 'M')[0].toUpperCase(), status_icone: 'gamepad', papel: ehAdmin ? 'responsavel' : 'aluno', pontos: 80 });
      return;
    }
    try {
      setCarregando(true);
      let res;
      if (modo === 'entrar') {
        if (!apelido.trim() || !senha) { setErro('Preencha apelido e senha.'); return; }
        res = await api.entrar(apelido.trim(), senha, 'doutor-blumenau');
      } else {
        if (!codigo.trim() || !apelido.trim()) { setErro('Preencha o código e escolha um apelido.'); return; }
        res = await api.resgatar(codigo.trim(), apelido.trim(), senha || undefined);
      }
      setToken(res.token); onEntrar(res.usuario);
    } catch (err) { setErro(err.message); } finally { setCarregando(false); }
  };

  return (
    <div className="login fachwerk">
      <button className="login-back" onClick={onBack}><Icon name="arrowLeft" size={18} /> Voltar</button>
      <div className="login-card">
        <img src="/logo.png" alt="SchuleZap" className="login-logo" />
        <Wordmark size={34} />
        <p className="login-sub">Rede Social Escolar de Pomerode, SC</p>
        <p className="login-tag">Nossa Pequena Alemanha.</p>
        <div className="login-tabs">
          <button type="button" className={modo === 'entrar' ? 'is-on' : ''} onClick={() => { setModo('entrar'); setErro(''); }}>Já tenho conta</button>
          <button type="button" className={modo === 'resgatar' ? 'is-on' : ''} onClick={() => { setModo('resgatar'); setErro(''); }}>Tenho um convite</button>
        </div>
        <form className="login-form" onSubmit={submit}>
          {modo === 'resgatar' && (<>
            <label className="login-label" htmlFor="cod">Código de convite</label>
            <input id="cod" className="input" value={codigo} onChange={(e) => setCodigo(e.target.value)} placeholder="6B-2026" autoComplete="off" style={{ textAlign: 'center', letterSpacing: '.08em', marginBottom: 12 }} />
          </>)}
          <label className="login-label" htmlFor="ap">Apelido</label>
          <input id="ap" className="input" value={apelido} onChange={(e) => setApelido(e.target.value)} placeholder={modo === 'resgatar' ? 'Como quer ser chamado' : 'Marco'} autoComplete="off" style={{ marginBottom: 12 }} />
          <label className="login-label" htmlFor="pw">Senha {modo === 'resgatar' && <span style={{ fontWeight: 700, color: 'var(--ink-3)' }}>(opcional)</span>}</label>
          <input id="pw" type="password" className="input" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="••••••" autoComplete="off" />
          {erro && <p className="login-err">{erro}</p>}
          <button type="submit" className="btn btn-red btn-block" style={{ marginTop: 14 }} disabled={carregando}>
            {carregando ? <><Icon name="refresh" size={18} /> Entrando…</> : <><Icon name={modo === 'resgatar' ? 'ticket' : 'user'} size={18} /> {modo === 'resgatar' ? 'Criar minha conta' : 'Entrar'}</>}
          </button>
          {!API_ATIVA && <button type="button" className="btn btn-ghost btn-block" style={{ marginTop: 10 }} onClick={() => onEntrar({ id: 1, apelido: 'Marco', avatar_inicial: 'M', status_icone: 'gamepad', papel: 'aluno', pontos: 80 })}>Ver a demo</button>}
        </form>
        <p className="login-notice"><Icon name="lock" size={14} /> Rede fechada. Só entra quem tem convite da escola.</p>
        <p className="login-credit">Criado por <strong>Thiago Tomelin</strong></p>
      </div>
      {toast && <div className="app-toast"><Icon name="check" size={16} stroke={3} />{toast}</div>}
    </div>
  );
}

/* ===================== NOTIFICAÇÕES ===================== */
function Notificacoes({ fechar }) {
  const [itens, setItens] = useState(API_ATIVA ? null : DEMO_NOTIFS);
  useEffect(() => { if (API_ATIVA) api.notificacoes().then(setItens).catch(() => setItens([])); }, []);
  const ic = { curtida: 'heart', comentario: 'comment', medalha: 'medal' };
  const tone = { curtida: 'red', comentario: 'blue', medalha: 'gold' };
  return (
    <div className="notif">
      <div className="notif-head"><strong>Notificações</strong><button className="app-icon-btn" onClick={fechar} aria-label="Fechar"><Icon name="x" size={18} /></button></div>
      {itens === null && <p className="feed-end">Carregando…</p>}
      {itens && itens.length === 0 && <p className="feed-end">Nada novo por aqui.</p>}
      {itens && itens.map((n, i) => (
        <div key={i} className="notif-item">
          <Tile icon={ic[n.tipo]} tone={tone[n.tipo]} size={34} radius={10} />
          <div className="notif-body">
            {n.tipo === 'curtida' && <p><strong>{n.quem.apelido}</strong> curtiu seu post: <em>"{n.texto}"</em></p>}
            {n.tipo === 'comentario' && <p><strong>{n.quem.apelido}</strong> comentou: <em>"{n.texto}"</em></p>}
            {n.tipo === 'medalha' && <p>Você ganhou a medalha <strong>{n.titulo}</strong></p>}
            <span>{n.tempo}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ===================== FEED ===================== */
function Feed({ usuario, showToast, temaInicial, limparTema, abrirPerfil }) {
  const [posts, setPosts] = useState(API_ATIVA ? [] : DEMO_POSTS);
  const [draft, setDraft] = useState('');
  const [imagem, setImagem] = useState(null);
  const [carregando, setCarregando] = useState(API_ATIVA);
  const [enviando, setEnviando] = useState(false);
  const [aberto, setAberto] = useState(null);
  const [menu, setMenu] = useState(null);
  const fileRef = React.useRef(null);

  useEffect(() => { if (temaInicial) { setDraft(temaInicial); limparTema(); } }, [temaInicial, limparTema]);

  const carregar = useCallback(async () => {
    if (!API_ATIVA) return;
    try { setCarregando(true); setPosts(await api.feed()); }
    catch (e) { showToast(e.message); } finally { setCarregando(false); }
  }, [showToast]);
  useEffect(() => { carregar(); }, [carregar]);

  const escolherFoto = (e) => {
    const f = e.target.files?.[0]; if (!f) return;
    if (f.size > 1.5 * 1024 * 1024) { showToast('Imagem muito grande (máx 1,5 MB)'); return; }
    const r = new FileReader(); r.onload = () => setImagem(r.result); r.readAsDataURL(f);
  };

  const publicar = async () => {
    if (!draft.trim() && !imagem) return;
    if (!API_ATIVA) {
      setPosts((p) => [{ id: Date.now(), autor: { id: usuario.id, avatar_inicial: usuario.avatar_inicial, apelido: usuario.apelido }, grupo: { nome: 'Turma 6ºB' }, tempo: 'agora', texto: draft.trim(), imagem_url: imagem, reacoes: 0, por_tipo: {}, minha_reacao: null, comentarios: 0, salvo: false }, ...p]);
      setDraft(''); setImagem(null); showToast('Publicado no mural'); return;
    }
    try { setEnviando(true); const novo = await api.criarPost(null, draft.trim(), imagem); setPosts((p) => [novo, ...p]); setDraft(''); setImagem(null); showToast('Publicado no mural'); }
    catch (e) { showToast(e.message); } finally { setEnviando(false); }
  };

  const reagir = async (id, tipo) => {
    setMenu(null);
    setPosts((p) => p.map((x) => {
      if (x.id !== id) return x;
      const mesma = x.minha_reacao === tipo;
      const tinha = !!x.minha_reacao;
      return { ...x, minha_reacao: mesma ? null : tipo, reacoes: x.reacoes + (mesma ? -1 : tinha ? 0 : 1) };
    }));
    if (API_ATIVA) { try { const r = await api.reagir(id, tipo); setPosts((p) => p.map((x) => x.id === id ? { ...x, minha_reacao: r.minha_reacao, reacoes: r.total, por_tipo: r.por_tipo } : x)); } catch (e) { showToast(e.message); carregar(); } }
  };

  const salvar = async (id) => {
    setPosts((p) => p.map((x) => x.id === id ? { ...x, salvo: !x.salvo } : x));
    if (API_ATIVA) { try { const r = await api.salvar(id); setPosts((p) => p.map((x) => x.id === id ? { ...x, salvo: r.salvo } : x)); showToast(r.salvo ? 'Post salvo' : 'Removido dos salvos'); } catch (e) { showToast(e.message); } }
    else showToast('Post salvo');
  };

  const remover = async (id) => {
    setMenu(null); setPosts((p) => p.filter((x) => x.id !== id));
    if (API_ATIVA) { try { await api.removerPost(id); } catch (e) { showToast(e.message); carregar(); return; } }
    showToast('Post removido');
  };
  const denunciar = async (id) => {
    setMenu(null);
    if (API_ATIVA) { try { await api.denunciar(id, 'Reportado pelo botão de denúncia'); } catch (e) { showToast(e.message); return; } }
    showToast('Denúncia enviada. Um responsável vai avaliar.');
  };

  const ehModerador = usuario.papel === 'responsavel' || usuario.papel === 'admin';
  const stories = API_ATIVA ? [...new Map(posts.map((p) => [p.autor.apelido, p.autor])).values()].slice(0, 6) : [{ id: 13, avatar_inicial: 'L', apelido: 'Lucas' }, { id: 12, avatar_inicial: 'B', apelido: 'Bel' }, { id: 14, avatar_inicial: 'T', apelido: 'Théo' }, { id: 15, avatar_inicial: 'H', apelido: 'Helena' }];

  return (
    <div onClick={() => menu && setMenu(null)}>
      <div className="stories">
        <div className="story"><div className="story-add"><Icon name="plus" size={18} stroke={2.5} /></div><span>Você</span></div>
        {stories.map((a) => <button key={a.apelido} className="story" onClick={() => a.id && abrirPerfil(a.id)}><Avatar initial={a.avatar_inicial} size={46} ring /><span>{a.apelido}</span></button>)}
      </div>

      <div className="composer">
        <Avatar initial={usuario.avatar_inicial} size={40} badgeIcon={usuario.status_icone} />
        <div className="composer-body">
          <textarea className="composer-input" rows={2} value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={`No que você tá pensando, ${usuario.apelido}?`} />
          {imagem && <div className="composer-preview"><img src={imagem} alt="prévia" /><button onClick={() => setImagem(null)} aria-label="Remover"><Icon name="x" size={16} stroke={2.5} /></button></div>}
          <div className="composer-actions">
            <div className="composer-tools">
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={escolherFoto} />
              <button className="app-icon-btn" aria-label="Foto" onClick={() => fileRef.current?.click()}><Icon name="photo" size={20} /></button>
            </div>
            <button className="btn btn-red btn-sm" onClick={publicar} disabled={enviando}>{enviando ? 'Enviando…' : <>Postar <Icon name="send" size={15} /></>}</button>
          </div>
        </div>
      </div>

      {carregando && <p className="feed-end">Carregando o mural…</p>}
      {!carregando && posts.length === 0 && <p className="feed-end">Nada por aqui ainda. Seja o primeiro a postar!</p>}

      {posts.map((p) => (
        <PostCard key={p.id} p={p} usuario={usuario} ehModerador={ehModerador}
          menuAberto={menu === p.id} setMenu={(v) => setMenu(v ? p.id : null)}
          comentariosAbertos={aberto === p.id} toggleComentarios={() => setAberto(aberto === p.id ? null : p.id)}
          onReagir={reagir} onSalvar={salvar} onRemover={remover} onDenunciar={denunciar} abrirPerfil={abrirPerfil}
          onNovoComentario={() => setPosts((ps) => ps.map((x) => x.id === p.id ? { ...x, comentarios: x.comentarios + 1 } : x))}
          showToast={showToast} />
      ))}
      {!carregando && posts.length > 0 && <p className="feed-end">Você viu tudo por aqui.</p>}
    </div>
  );
}

function PostCard({ p, usuario, ehModerador, menuAberto, setMenu, comentariosAbertos, toggleComentarios, onReagir, onSalvar, onRemover, onDenunciar, abrirPerfil, onNovoComentario, showToast }) {
  const [picker, setPicker] = useState(false);
  const meu = p.autor?.id === usuario.id || p.autor?.apelido === usuario.apelido;
  const minha = p.minha_reacao;
  const tipos = Object.entries(p.por_tipo || {}).filter(([, n]) => n > 0).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([t]) => t);

  return (
    <article className="post">
      <div className="post-head">
        <button className="post-avatar-btn" onClick={() => p.autor?.id && abrirPerfil(p.autor.id)}><Avatar initial={p.autor.avatar_inicial} size={42} /></button>
        <div className="post-who">
          <strong><button className="post-autor" onClick={() => p.autor?.id && abrirPerfil(p.autor.id)}>{p.autor.apelido}</button>{p.badge && <span className="post-badge"><Icon name="medal" size={11} stroke={2.5} />{p.badge}</span>}</strong>
          <span>{p.grupo?.nome} · {p.tempo}</span>
        </div>
        <div className="post-menu-wrap" onClick={(e) => e.stopPropagation()}>
          <button className="app-icon-btn" aria-label="Mais" onClick={() => setMenu(!menuAberto)}><Icon name="dots" size={20} /></button>
          {menuAberto && (
            <div className="post-menu">
              <button onClick={() => onSalvar(p.id)}><Icon name="star" size={16} /> {p.salvo ? 'Remover dos salvos' : 'Salvar post'}</button>
              {(meu || ehModerador) && <button onClick={() => onRemover(p.id)} className="perigo"><Icon name="x" size={16} /> Remover post</button>}
              {!meu && <button onClick={() => onDenunciar(p.id)} className="perigo"><Icon name="flag" size={16} /> Denunciar</button>}
            </div>
          )}
        </div>
      </div>
      {p.texto && <p className="post-text">{p.texto}</p>}
      {p.imagem_url && <div className="post-img"><img src={p.imagem_url} alt="" /></div>}
      {p.reacoes > 0 && (
        <div className="post-resumo">
          <span className="post-resumo-emojis">{tipos.map((t) => <span key={t}>{emojiDe(t)}</span>)}</span>
          <span>{p.reacoes}</span>
          {p.comentarios > 0 && <span className="post-resumo-com">{p.comentarios} comentário{p.comentarios > 1 ? 's' : ''}</span>}
        </div>
      )}
      <div className="post-actions" onClick={(e) => e.stopPropagation()}>
        <div className="reagir-wrap" onMouseLeave={() => setPicker(false)}>
          {picker && (
            <div className="reagir-picker">
              {REACOES.map((r) => <button key={r.tipo} title={r.label} onClick={() => { onReagir(p.id, r.tipo); setPicker(false); }}>{r.emoji}</button>)}
            </div>
          )}
          <button className={`post-acao ${minha ? 'is-on' : ''}`} onClick={() => onReagir(p.id, minha || 'curtida')} onMouseEnter={() => setPicker(true)}>
            {minha ? <><span className="post-acao-emoji">{emojiDe(minha)}</span> {REACOES.find((r) => r.tipo === minha)?.label}</> : <><Icon name="heart" size={18} /> Curtir</>}
          </button>
        </div>
        <button className={`post-acao ${comentariosAbertos ? 'is-on' : ''}`} onClick={toggleComentarios}><Icon name="comment" size={18} /> Comentar</button>
        <button className={`post-acao ${p.salvo ? 'is-on' : ''}`} onClick={() => onSalvar(p.id)}><Icon name="star" size={18} /> {p.salvo ? 'Salvo' : 'Salvar'}</button>
      </div>
      {comentariosAbertos && <Comentarios post={p} usuario={usuario} showToast={showToast} onNovo={onNovoComentario} abrirPerfil={abrirPerfil} />}
    </article>
  );
}

function Comentarios({ post, usuario, showToast, onNovo, abrirPerfil }) {
  const [lista, setLista] = useState(API_ATIVA ? null : (DEMO_COMENTARIOS[post.id] || []));
  const [texto, setTexto] = useState('');
  const [respondendo, setRespondendo] = useState(null); // {id, apelido}
  const [enviando, setEnviando] = useState(false);

  useEffect(() => { if (API_ATIVA) api.comentarios(post.id).then(setLista).catch(() => setLista([])); }, [post.id]);

  const enviar = async () => {
    if (!texto.trim()) return;
    const novoLocal = { id: Date.now(), autor: { id: usuario.id, avatar_inicial: usuario.avatar_inicial, apelido: usuario.apelido }, texto: texto.trim(), respondendo_id: respondendo?.id || null };
    if (!API_ATIVA) { setLista((l) => [...l, novoLocal]); setTexto(''); setRespondendo(null); onNovo(); return; }
    try {
      setEnviando(true);
      const c = await api.comentar(post.id, texto.trim(), respondendo?.id);
      setLista((l) => [...(l || []), c]); setTexto(''); setRespondendo(null); onNovo();
    } catch (e) { showToast(e.message); } finally { setEnviando(false); }
  };

  // organiza: raiz + respostas aninhadas
  const raizes = (lista || []).filter((c) => !c.respondendo_id);
  const respostasDe = (id) => (lista || []).filter((c) => c.respondendo_id === id);

  const Item = ({ c, filho }) => (
    <div className={`coment ${filho ? 'is-resposta' : ''}`}>
      <button className="post-avatar-btn" onClick={() => c.autor?.id && abrirPerfil?.(c.autor.id)}><Avatar initial={c.autor.avatar_inicial} size={filho ? 24 : 28} /></button>
      <div>
        <strong><button className="post-autor" onClick={() => c.autor?.id && abrirPerfil?.(c.autor.id)}>{c.autor.apelido}</button></strong>
        <p>{c.texto}</p>
        {!filho && <button className="coment-responder" onClick={() => setRespondendo({ id: c.id, apelido: c.autor.apelido })}>Responder</button>}
      </div>
    </div>
  );

  return (
    <div className="coments" onClick={(e) => e.stopPropagation()}>
      {lista === null && <p className="coments-empty">Carregando…</p>}
      {lista && lista.length === 0 && <p className="coments-empty">Seja o primeiro a comentar.</p>}
      {raizes.map((c) => (
        <div key={c.id}>
          <Item c={c} />
          {respostasDe(c.id).map((r) => <Item key={r.id} c={r} filho />)}
        </div>
      ))}
      {respondendo && (
        <div className="coment-respondendo">
          Respondendo a <strong>{respondendo.apelido}</strong>
          <button onClick={() => setRespondendo(null)} aria-label="Cancelar"><Icon name="x" size={14} stroke={2.5} /></button>
        </div>
      )}
      <div className="coment-form">
        <input className="input" value={texto} onChange={(e) => setTexto(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && enviar()} placeholder={respondendo ? `Responder a ${respondendo.apelido}…` : 'Escreva um comentário…'} />
        <button className="btn btn-red btn-sm" onClick={enviar} disabled={enviando}><Icon name="send" size={15} /></button>
      </div>
    </div>
  );
}

/* ===================== BUSCA ===================== */
function Busca({ abrirPerfil, irGrupos, fechar }) {
  const [q, setQ] = useState('');
  const [res, setRes] = useState(null);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (q.trim().length < 2) { setRes(null); return; }
    const t = setTimeout(async () => {
      if (!API_ATIVA) {
        const termo = q.toLowerCase();
        setRes({
          pessoas: [{ id: 12, apelido: 'Bel', avatar_inicial: 'B', bio: 'Amo futebol' }, { id: 13, apelido: 'Lucas', avatar_inicial: 'L' }].filter((p) => p.apelido.toLowerCase().includes(termo)),
          grupos: DEMO_GROUPS.filter((g) => g.nome.toLowerCase().includes(termo)),
        });
        return;
      }
      try { setCarregando(true); setRes(await api.buscar(q.trim())); } catch (e) { setRes({ pessoas: [], grupos: [] }); } finally { setCarregando(false); }
    }, 300);
    return () => clearTimeout(t);
  }, [q]);

  const vazio = res && res.pessoas.length === 0 && res.grupos.length === 0;

  return (
    <div className="busca">
      <div className="busca-head">
        <div className="busca-campo">
          <Icon name="search" size={18} style={{ color: 'var(--ink-3)' }} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar pessoas e grupos…" autoFocus />
        </div>
        <button className="app-icon-btn" onClick={fechar} aria-label="Fechar"><Icon name="x" size={18} /></button>
      </div>
      {q.trim().length < 2 && <p className="coments-empty" style={{ padding: '0 16px 14px' }}>Digite ao menos 2 letras.</p>}
      {carregando && <p className="feed-end">Buscando…</p>}
      {vazio && <p className="feed-end">Nada encontrado para "{q}".</p>}
      {res && res.pessoas.length > 0 && <p className="label busca-label">Pessoas</p>}
      {res && res.pessoas.map((p) => (
        <button key={p.id} className="row-card row-card--btn busca-item" onClick={() => abrirPerfil(p.id)}>
          <Avatar initial={p.avatar_inicial} size={42} />
          <div className="row-card-body"><strong>{p.apelido}</strong><span>{p.bio || 'Aluno'}</span></div>
          <Icon name="chevronRight" size={20} style={{ color: 'var(--ink-3)' }} />
        </button>
      ))}
      {res && res.grupos.length > 0 && <p className="label busca-label">Grupos</p>}
      {res && res.grupos.map((g) => (
        <button key={g.id} className="row-card row-card--btn busca-item" onClick={irGrupos}>
          <Tile icon={g.icone} tone={TONE_POR_ICONE[g.icone] || 'red'} size={42} radius={13} />
          <div className="row-card-body"><strong>{g.nome}</strong><span>{g.membros} colegas</span></div>
          <Icon name="chevronRight" size={20} style={{ color: 'var(--ink-3)' }} />
        </button>
      ))}
    </div>
  );
}

/* ===================== PERFIL DE OUTRA PESSOA ===================== */
function PerfilOutro({ id, usuario, showToast, voltar }) {
  const [dados, setDados] = useState(null);
  const [posts, setPosts] = useState([]);
  const [seguindo, setSeguindo] = useState(false);

  useEffect(() => {
    if (!API_ATIVA) {
      setDados({ usuario: { id, apelido: 'Bel', avatar_inicial: 'B', status_icone: 'ball', bio: 'Amo futebol ⚽', pontos: 140 }, escola: 'Escola Doutor Blumenau', sou_eu: false, eu_sigo: false, stats: { posts: 12, curtidas: 48, pontos: 140, ranking: 1, seguidores: 8, seguindo: 5 }, medalhas: [{ icone: 'medal', titulo: 'Craque da semana' }] });
      setPosts(DEMO_POSTS.filter((p) => p.autor.apelido === 'Bel'));
      return;
    }
    api.perfil(id).then((d) => { setDados(d); setSeguindo(d.eu_sigo); }).catch((e) => showToast(e.message));
    api.feed && fetch(`${process.env.REACT_APP_API_URL}/feed?usuario_id=${id}`, { headers: { Authorization: `Bearer ${window.__sz_token}` } }).then((r) => r.json()).then(setPosts).catch(() => {});
  }, [id, showToast]);

  const toggleSeguir = async () => {
    setSeguindo((s) => !s);
    setDados((d) => d ? { ...d, stats: { ...d.stats, seguidores: d.stats.seguidores + (seguindo ? -1 : 1) } } : d);
    if (API_ATIVA) { try { const r = await api.seguir(id); setSeguindo(r.seguindo); } catch (e) { showToast(e.message); } }
    else showToast(seguindo ? 'Deixou de seguir' : 'Seguindo!');
  };

  if (!dados) return <p className="feed-end">Carregando perfil…</p>;
  const u = dados.usuario;
  const tones = ['gold', 'red', 'blue', 'green'];

  return (
    <div>
      <div className="perfil-topo">
        <button className="voltar-link" onClick={voltar}><Icon name="arrowLeft" size={16} /> Voltar</button>
      </div>
      <div className="profile-hero fachwerk">
        <div className="profile-avatar"><Avatar initial={u.avatar_inicial} size={88} badgeIcon={u.status_icone} /></div>
        <h2 className="h2" style={{ marginTop: 10 }}>{u.apelido}</h2>
        {u.bio && <p className="perfil-bio">{u.bio}</p>}
        <p className="profile-school">{dados.escola} · Pomerode</p>
        {!dados.sou_eu && (
          <button className={`btn btn-sm ${seguindo ? 'btn-ghost' : 'btn-red'}`} style={{ marginTop: 12 }} onClick={toggleSeguir}>
            {seguindo ? <><Icon name="check" size={15} stroke={3} /> Seguindo</> : <><Icon name="plus" size={15} stroke={3} /> Seguir</>}
          </button>
        )}
      </div>
      <div className="stats">
        {[[dados.stats.posts, 'Posts'], [dados.stats.seguidores, 'Seguidores'], [dados.stats.seguindo, 'Seguindo'], [dados.stats.pontos, 'Pontos']].map(([n, l]) => (
          <div key={l} className="stat"><strong>{n}</strong><span>{l}</span></div>
        ))}
      </div>
      <div className="pad">
        {dados.medalhas?.length > 0 && (<>
          <p className="label">Conquistas</p>
          <div className="badges">{dados.medalhas.map((m, i) => <div key={m.titulo} className="badge-card"><Tile icon={m.icone || 'medal'} tone={tones[i % 4]} size={36} radius={10} /><span>{m.titulo}</span></div>)}</div>
        </>)}
        <p className="label" style={{ marginTop: 22 }}>Posts de {u.apelido}</p>
        {posts.length === 0 && <p className="coments-empty">Ainda não postou nada.</p>}
        {posts.map((p) => (
          <div key={p.id} className="mini-post">
            {p.texto && <p>{p.texto}</p>}
            {p.imagem_url && <img src={p.imagem_url} alt="" />}
            <span>{emojiDe(p.minha_reacao || 'curtida')} {p.reacoes} · {p.comentarios} comentários</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===================== GRUPOS ===================== */
function Grupos({ showToast }) {
  const [grupos, setGrupos] = useState(API_ATIVA ? [] : DEMO_GROUPS);
  const [carregando, setCarregando] = useState(API_ATIVA);
  const [criando, setCriando] = useState(false);
  const [nome, setNome] = useState('');
  const [icone, setIcone] = useState('users');

  const carregar = useCallback(async () => {
    if (!API_ATIVA) return;
    try { setCarregando(true); setGrupos(await api.grupos()); } catch (e) { showToast(e.message); } finally { setCarregando(false); }
  }, [showToast]);
  useEffect(() => { carregar(); }, [carregar]);

  const alternar = async (g) => {
    setGrupos((gs) => gs.map((x) => x.id === g.id ? { ...x, participando: !x.participando, membros: x.membros + (x.participando ? -1 : 1) } : x));
    if (API_ATIVA) { try { g.participando ? await api.sairGrupo(g.id) : await api.entrarGrupo(g.id); } catch (e) { showToast(e.message); carregar(); } }
  };

  const criar = async () => {
    if (!nome.trim()) { showToast('Dê um nome pro grupo'); return; }
    if (!API_ATIVA) { setGrupos((gs) => [{ id: Date.now(), nome: nome.trim(), icone, membros: 1, participando: true }, ...gs]); }
    else { try { await api.criarGrupo(nome.trim(), icone, TONE_POR_ICONE[icone] || 'red'); await carregar(); } catch (e) { showToast(e.message); return; } }
    setNome(''); setCriando(false); showToast('Grupo criado');
  };

  return (
    <div className="pad">
      <h2 className="h2">Grupos</h2>
      <p className="sub">Cada grupo tem seu próprio mural.</p>

      {criando ? (
        <div className="criar-grupo">
          <input className="input" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome do grupo (ex.: Xadrez)" autoFocus />
          <p className="label" style={{ margin: '12px 0 8px' }}>Ícone</p>
          <div className="icone-grid">
            {ICONES_GRUPO.map((ic) => <button key={ic} className={`status-btn ${icone === ic ? 'is-active' : ''}`} onClick={() => setIcone(ic)} aria-label={ic}><Icon name={ic} size={20} /></button>)}
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            <button className="btn btn-red btn-sm" onClick={criar}><Icon name="check" size={15} stroke={3} /> Criar</button>
            <button className="btn btn-ghost btn-sm" onClick={() => setCriando(false)}>Cancelar</button>
          </div>
        </div>
      ) : (
        <button className="btn btn-gold btn-block" style={{ marginBottom: 14 }} onClick={() => setCriando(true)}><Icon name="plus" size={18} stroke={2.5} /> Criar grupo</button>
      )}

      {carregando && <p className="feed-end">Carregando…</p>}
      {grupos.map((g) => (
        <div key={g.id} className="row-card">
          <Tile icon={g.icone} tone={TONE_POR_ICONE[g.icone] || 'red'} size={48} radius={14} />
          <div className="row-card-body"><strong>{g.nome}</strong><span>{g.membros} colegas</span></div>
          <button onClick={() => alternar(g)} className={`btn btn-sm ${g.participando ? 'btn-ghost' : 'btn-red'}`}>
            {g.participando ? <><Icon name="check" size={15} stroke={3} /> Dentro</> : 'Entrar'}
          </button>
        </div>
      ))}
    </div>
  );
}

/* ===================== DESAFIOS ===================== */
function Jogos({ showToast, usuario, setUsuario, irPostar }) {
  const [jogo, setJogo] = useState(null); // null | quiz | palavra | placar | desenho
  const [jogados, setJogados] = useState([]);

  useEffect(() => { if (API_ATIVA) api.desafiosHoje().then((r) => setJogados(r.jogados)).catch(() => {}); }, [jogo]);

  const registrar = async (desafio, acertos, total) => {
    if (!API_ATIVA) { showToast(`+${acertos * 10 + (acertos === total ? 20 : 0)} pontos (demo)`); return; }
    try {
      const r = await api.desafioResultado(desafio, acertos, total);
      if (r.ja_jogou) { showToast('Você já jogou esse hoje. Volta amanhã!'); return; }
      setUsuario({ ...usuario, pontos: r.pontos });
      const med = r.medalhas_novas?.length ? ` · medalha: ${r.medalhas_novas.map((m) => m.titulo).join(', ')}` : '';
      showToast(`+${r.pontos_ganhos} pontos${med}`);
    } catch (e) { showToast(e.message); }
  };

  if (jogo === 'quiz') return <QuizJogo voltar={() => setJogo(null)} aoTerminar={(a, t) => registrar('quiz', a, t)} />;
  if (jogo === 'palavra') return <PalavraJogo voltar={() => setJogo(null)} aoTerminar={(a, t) => registrar('palavra', a, t)} />;
  if (jogo === 'placar') return <PlacarJogo voltar={() => setJogo(null)} irPostar={irPostar} aoTerminar={() => registrar('placar', 1, 1)} />;

  const jog = (d) => jogados.includes(d);
  const cards = [
    ['quiz', 'bulb', 'blue', 'Quiz de Pomerode', '4 perguntas · até 60 pts'],
    ['palavra', 'language', 'gold', 'Palavra em alemão', '3 palavras do dia · até 50 pts'],
    ['placar', 'ball', 'green', 'Adivinha o placar', 'Dê seu palpite · 30 pts'],
  ];

  return (
    <div className="pad">
      <div className="jogos-head">
        <div><h2 className="h2">Desafios</h2><p className="sub" style={{ margin: 0 }}>Um por dia. Sobe no ranking da turma.</p></div>
        <div className="pontos-chip"><Icon name="star" size={16} stroke={2.5} />{usuario.pontos ?? 0} pts</div>
      </div>
      {cards.map(([id, ic, tone, t, d]) => (
        <button key={id} className={`row-card row-card--btn ${jog(id) ? 'is-done' : ''}`} onClick={() => jog(id) ? showToast('Já jogado hoje. Volta amanhã!') : setJogo(id)}>
          <Tile icon={ic} tone={tone} size={48} radius={14} />
          <div className="row-card-body"><strong>{t}</strong><span>{jog(id) ? 'Feito hoje ✓' : d}</span></div>
          <Icon name={jog(id) ? 'check' : 'chevronRight'} size={20} style={{ color: jog(id) ? '#3B6D11' : 'var(--ink-3)' }} />
        </button>
      ))}
      <div className="desenho-card fachwerk">
        <div className="desenho-head"><Tile icon="palette" tone="red" size={40} radius={12} /><div><strong>Desenho do dia</strong><span>Tema de hoje</span></div></div>
        <p className="desenho-tema">"{temaDeHoje()}"</p>
        <button className="btn btn-red btn-sm" onClick={() => irPostar(`Meu desenho do dia — tema: ${temaDeHoje()} 🎨`)}><Icon name="send" size={15} /> Postar meu desenho</button>
      </div>
    </div>
  );
}

function QuizJogo({ voltar, aoTerminar }) {
  const [i, setI] = useState(0); const [picked, setPicked] = useState(null); const [score, setScore] = useState(0); const [done, setDone] = useState(false);
  const q = QUIZ[i];
  const next = () => {
    if (picked === null) return;
    const s = score + (picked === q.correct ? 1 : 0);
    if (i + 1 >= QUIZ.length) { setScore(s); setDone(true); aoTerminar(s, QUIZ.length); } else { setScore(s); setI(i + 1); setPicked(null); }
  };
  if (done) return <Resultado score={score} total={QUIZ.length} voltar={voltar} />;
  return (
    <div className="pad">
      <button className="voltar-link" onClick={voltar}><Icon name="arrowLeft" size={16} /> Desafios</button>
      <div className="quiz fachwerk">
        <div className="quiz-head"><span className="quiz-title"><Icon name="bulb" size={16} stroke={2.5} /> Quiz de Pomerode</span><span className="quiz-prog">{i + 1}/{QUIZ.length}</span></div>
        <p className="quiz-q">{q.q}</p>
        <div className="quiz-opts">
          {q.a.map((opt, idx) => {
            const reveal = picked !== null, correct = idx === q.correct, mine = picked === idx;
            return <button key={idx} className={`quiz-opt ${reveal && correct ? 'is-correct' : ''} ${reveal && mine && !correct ? 'is-wrong' : ''}`} onClick={() => picked === null && setPicked(idx)}>{opt}{reveal && correct && <Icon name="check" size={18} stroke={3} />}{reveal && mine && !correct && <Icon name="x" size={18} stroke={3} />}</button>;
          })}
        </div>
        <button className="btn btn-red btn-block" style={{ marginTop: 14 }} onClick={next} disabled={picked === null}>{i + 1 >= QUIZ.length ? 'Ver resultado' : 'Próxima'} <Icon name="arrowRight" size={18} /></button>
      </div>
    </div>
  );
}

function PalavraJogo({ voltar, aoTerminar }) {
  const palavras = palavrasDeHoje();
  const [i, setI] = useState(0); const [picked, setPicked] = useState(null); const [score, setScore] = useState(0); const [done, setDone] = useState(false);
  const p = palavras[i];
  const next = () => {
    if (picked === null) return;
    const s = score + (p.opts[picked] === p.pt ? 1 : 0);
    if (i + 1 >= palavras.length) { setScore(s); setDone(true); aoTerminar(s, palavras.length); } else { setScore(s); setI(i + 1); setPicked(null); }
  };
  if (done) return <Resultado score={score} total={palavras.length} voltar={voltar} />;
  return (
    <div className="pad">
      <button className="voltar-link" onClick={voltar}><Icon name="arrowLeft" size={16} /> Desafios</button>
      <div className="quiz fachwerk">
        <div className="quiz-head"><span className="quiz-title"><Icon name="language" size={16} stroke={2.5} /> Palavra em alemão</span><span className="quiz-prog">{i + 1}/{palavras.length}</span></div>
        <p className="palavra-de">{p.de}</p>
        <p className="quiz-q" style={{ fontSize: 14, color: 'var(--ink-2)' }}>O que significa?</p>
        <div className="quiz-opts">
          {p.opts.map((opt, idx) => {
            const reveal = picked !== null, correct = opt === p.pt, mine = picked === idx;
            return <button key={idx} className={`quiz-opt ${reveal && correct ? 'is-correct' : ''} ${reveal && mine && !correct ? 'is-wrong' : ''}`} onClick={() => picked === null && setPicked(idx)}>{opt}{reveal && correct && <Icon name="check" size={18} stroke={3} />}{reveal && mine && !correct && <Icon name="x" size={18} stroke={3} />}</button>;
          })}
        </div>
        <button className="btn btn-red btn-block" style={{ marginTop: 14 }} onClick={next} disabled={picked === null}>{i + 1 >= palavras.length ? 'Ver resultado' : 'Próxima'} <Icon name="arrowRight" size={18} /></button>
      </div>
    </div>
  );
}

function PlacarJogo({ voltar, irPostar, aoTerminar }) {
  const [a, setA] = useState(2); const [b, setB] = useState(1);
  const enviar = () => { aoTerminar(); irPostar(`Meu palpite pro jogo de sábado: Escola ${a} x ${b} Visitante ⚽`); };
  const Num = ({ v, set }) => (
    <div className="placar-num">
      <button className="status-btn" onClick={() => set(Math.min(9, v + 1))} aria-label="mais"><Icon name="chevronDown" size={20} style={{ transform: 'rotate(180deg)' }} /></button>
      <strong>{v}</strong>
      <button className="status-btn" onClick={() => set(Math.max(0, v - 1))} aria-label="menos"><Icon name="chevronDown" size={20} /></button>
    </div>
  );
  return (
    <div className="pad">
      <button className="voltar-link" onClick={voltar}><Icon name="arrowLeft" size={16} /> Desafios</button>
      <div className="quiz fachwerk">
        <div className="quiz-head"><span className="quiz-title"><Icon name="ball" size={16} stroke={2.5} /> Adivinha o placar</span><span className="quiz-prog">sábado</span></div>
        <p className="quiz-q">Qual vai ser o placar do jogo da escola?</p>
        <div className="placar">
          <div className="placar-time"><Tile icon="school" tone="red" size={40} radius={12} /><span>Escola</span></div>
          <Num v={a} set={setA} /><span className="placar-x">×</span><Num v={b} set={setB} />
          <div className="placar-time"><Tile icon="ball" tone="blue" size={40} radius={12} /><span>Visitante</span></div>
        </div>
        <button className="btn btn-red btn-block" style={{ marginTop: 14 }} onClick={enviar}><Icon name="send" size={16} /> Enviar palpite (+30 pts)</button>
        <p className="placar-nota">Seu palpite vai pro mural. Quem acertar ganha a figurinha rara.</p>
      </div>
    </div>
  );
}

function Resultado({ score, total, voltar }) {
  const perfeito = score === total;
  return (
    <div className="pad" style={{ textAlign: 'center', paddingTop: 36 }}>
      <div className="result-tile"><Icon name={perfeito ? 'trophy' : 'sparkles'} size={44} /></div>
      <h2 className="h2" style={{ marginTop: 18 }}>{score} de {total}</h2>
      <p className="sub">{perfeito ? 'Gabaritou! Bônus de 20 pontos.' : score >= total / 2 ? 'Mandou bem, craque de Pomerode.' : 'Boa tentativa. Amanhã tem mais.'}</p>
      <p className="result-pts">+{score * 10 + (perfeito ? 20 : 0)} pontos</p>
      <button className="btn btn-red" style={{ marginTop: 14 }} onClick={voltar}><Icon name="arrowLeft" size={18} /> Voltar aos desafios</button>
    </div>
  );
}

/* ===================== RANKING ===================== */
function Ranking({ usuario, abrirPerfil }) {
  const [dados, setDados] = useState(API_ATIVA ? null : DEMO_RANKING);
  useEffect(() => { if (API_ATIVA) api.ranking().then(setDados).catch(() => setDados({ top: [], minha_posicao: '-', meus_pontos: 0 })); }, []);
  const medalha = (pos) => pos === 1 ? 'gold' : pos === 2 ? 'ink' : pos === 3 ? 'red' : null;
  return (
    <div className="pad">
      <h2 className="h2">Ranking da turma</h2>
      <p className="sub">Pontos dos desafios. Zera toda segunda? Não — é pra sempre.</p>
      {dados && (
        <div className="rank-me fachwerk">
          <div><span>Sua posição</span><strong>{dados.minha_posicao}º</strong></div>
          <div><span>Seus pontos</span><strong>{dados.meus_pontos}</strong></div>
        </div>
      )}
      {dados === null && <p className="feed-end">Carregando…</p>}
      {dados && dados.top.length === 0 && <p className="feed-end">Ninguém pontuou ainda. Vai nos Desafios e seja o primeiro!</p>}
      {dados && dados.top.map((r) => (
        <button key={r.posicao} className={`rank-row ${r.eu ? 'is-me' : ''}`} onClick={() => !r.eu && r.usuario.id && abrirPerfil?.(r.usuario.id)}>
          <div className="rank-pos">{medalha(r.posicao) ? <Tile icon="medal" tone={medalha(r.posicao)} size={30} radius={9} /> : <span>{r.posicao}</span>}</div>
          <Avatar initial={r.usuario.avatar_inicial} size={36} />
          <strong className="rank-nome">{r.usuario.apelido}{r.eu && <em> (você)</em>}</strong>
          <span className="rank-pts">{r.pontos} pts</span>
        </button>
      ))}
    </div>
  );
}

/* ===================== PERFIL ===================== */
function Perfil({ usuario, setUsuario, onLogout, showToast }) {
  const [dados, setDados] = useState(null);
  const [status, setStatusLocal] = useState(usuario.status_icone || 'gamepad');
  const [bio, setBio] = useState(usuario.bio || '');
  const [editandoBio, setEditandoBio] = useState(false);
  useEffect(() => { if (API_ATIVA) api.perfil().then((d) => { setDados(d); setBio(d.usuario.bio || ''); }).catch(() => {}); }, []);

  const salvarBio = async () => {
    setEditandoBio(false); setUsuario({ ...usuario, bio });
    if (API_ATIVA) { try { await api.atualizarPerfil({ bio }); showToast?.('Bio atualizada'); } catch (e) { showToast?.(e.message); } }
    else showToast?.('Bio atualizada');
  };
  const trocarStatus = async (s) => { setStatusLocal(s); setUsuario({ ...usuario, status_icone: s }); if (API_ATIVA) { try { await api.atualizarPerfil({ status_icone: s }); } catch (e) { /* */ } } };
  const stats = dados?.stats || { posts: 0, curtidas: 0, pontos: usuario.pontos ?? 0, ranking: '-' };
  const medalhas = dados?.medalhas?.length ? dados.medalhas : (API_ATIVA ? [] : [{ icone: 'medal', titulo: 'Craque da semana' }, { icone: 'flame', titulo: '7 dias seguidos' }, { icone: 'bulb', titulo: 'Quiz perfeito' }, { icone: 'users', titulo: '5 amigos' }]);
  const tones = ['gold', 'red', 'blue', 'green'];
  return (
    <div>
      <div className="profile-hero fachwerk">
        <div className="profile-avatar"><Avatar initial={usuario.avatar_inicial} size={88} badgeIcon={status} /></div>
        <h2 className="h2" style={{ marginTop: 10 }}>{usuario.apelido}</h2>
        {!editandoBio && <p className="perfil-bio" onClick={() => setEditandoBio(true)}>{bio || 'Toque para escrever sua bio…'}</p>}
        {editandoBio && (
          <div className="bio-edit">
            <input className="input" value={bio} maxLength={160} onChange={(e) => setBio(e.target.value)} placeholder="Fale de você em uma linha" autoFocus />
            <button className="btn btn-red btn-sm" onClick={salvarBio}><Icon name="check" size={15} stroke={3} /></button>
          </div>
        )}
        <p className="profile-school">{dados?.escola || 'Escola Doutor Blumenau'} · Pomerode</p>
      </div>
      <div className="stats">
        {[[stats.posts, 'Posts'], [stats.seguidores ?? 0, 'Seguidores'], [stats.pontos, 'Pontos'], [`${stats.ranking}º`, 'Ranking']].map(([n, l]) => <div key={l} className="stat"><strong>{n}</strong><span>{l}</span></div>)}
      </div>
      <div className="pad">
        <p className="label">Status do dia</p>
        <div className="status-grid">{STATUS.map((s) => <button key={s} onClick={() => trocarStatus(s)} className={`status-btn ${status === s ? 'is-active' : ''}`} aria-label={s}><Icon name={s} size={22} /></button>)}</div>
        <p className="label" style={{ marginTop: 22 }}>Conquistas</p>
        {medalhas.length === 0 && <p className="coments-empty">Jogue os desafios pra ganhar medalhas.</p>}
        <div className="badges">{medalhas.map((m, i) => <div key={m.titulo} className="badge-card"><Tile icon={m.icone || 'medal'} tone={tones[i % 4]} size={36} radius={10} /><span>{m.titulo}</span></div>)}</div>
        <button className="btn btn-ghost btn-block" style={{ marginTop: 22 }} onClick={onLogout}><Icon name="logout" size={18} /> Sair</button>
        <p className="profile-credit">Criado por <strong>Thiago Tomelin</strong></p>
      </div>
    </div>
  );
}

/* ===================== MODERAR ===================== */
function Moderar({ showToast }) {
  const [painel, setPainel] = useState(null);
  const [denuncias, setDenuncias] = useState([]);
  const [convites, setConvites] = useState([]);
  const [turma, setTurma] = useState('6B');
  const [gerando, setGerando] = useState(false);

  const carregar = useCallback(async () => {
    if (!API_ATIVA) {
      setPainel({ alunos: 24, convites_usados: 18, posts_semana: 86, denuncias_abertas: 1 });
      setDenuncias([{ id: 1, motivo: 'Conteúdo ofensivo', post: { texto: 'Post reportado de exemplo…', autor: 'Anônimo' } }]);
      setConvites([{ codigo: '6B-7HUO', turma: '6B', usado: false }, { codigo: '6B-K59V', turma: '6B', usado: true, usado_por: 'Marco' }]);
      return;
    }
    try { const [p, d, c] = await Promise.all([api.admin.painel(), api.admin.denuncias(), api.admin.convites()]); setPainel(p); setDenuncias(d); setConvites(c); }
    catch (e) { showToast(e.message); }
  }, [showToast]);
  useEffect(() => { carregar(); }, [carregar]);

  const resolver = async (id, acao) => {
    setDenuncias((ds) => ds.filter((d) => d.id !== id));
    if (API_ATIVA) { try { await api.admin.resolverDenuncia(id, acao); } catch (e) { showToast(e.message); carregar(); return; } }
    showToast(acao === 'ocultar' ? 'Post ocultado' : 'Denúncia descartada');
  };
  const gerar = async () => {
    if (!API_ATIVA) { showToast('Convites gerados (demo)'); return; }
    try { setGerando(true); const novos = await api.admin.gerarConvites(turma, 5); setConvites((c) => [...novos.map((n) => ({ ...n, usado: false })), ...c]); showToast(`${novos.length} convites gerados`); }
    catch (e) { showToast(e.message); } finally { setGerando(false); }
  };
  const copiar = (codigo) => { try { navigator.clipboard.writeText(codigo); showToast(`${codigo} copiado`); } catch (e) { showToast(codigo); } };

  return (
    <div className="pad">
      <h2 className="h2">Painel do responsável</h2>
      <p className="sub">Acompanhe e modere a rede da escola.</p>
      <div className="mod-stats">
        {[['users', 'Alunos', painel?.alunos ?? '—'], ['ticket', 'Convites usados', painel?.convites_usados ?? '—'], ['grid', 'Posts na semana', painel?.posts_semana ?? '—'], ['flag', 'Denúncias', painel?.denuncias_abertas ?? denuncias.length]].map(([ic, lb, v]) => (
          <div key={lb} className="mod-stat"><Tile icon={ic} tone="ink" size={34} radius={10} /><div><strong>{v}</strong><span>{lb}</span></div></div>
        ))}
      </div>
      <p className="label" style={{ marginTop: 8 }}>Denúncias abertas</p>
      {denuncias.length === 0 && <div className="mod-empty"><Icon name="check" size={22} stroke={2.5} /> Tudo tranquilo por aqui.</div>}
      {denuncias.map((d) => (
        <div key={d.id} className="mod-denuncia">
          <p className="mod-denuncia-txt">"{d.post?.texto}"</p>
          <p className="mod-denuncia-meta">por {d.post?.autor} {d.motivo && `· ${d.motivo}`}</p>
          <div className="mod-denuncia-acoes">
            <button className="btn btn-red btn-sm" onClick={() => resolver(d.id, 'ocultar')}><Icon name="eye" size={15} /> Ocultar post</button>
            <button className="btn btn-ghost btn-sm" onClick={() => resolver(d.id, 'descartar')}>Descartar</button>
          </div>
        </div>
      ))}
      <p className="label" style={{ marginTop: 22 }}>Convites <span style={{ fontWeight: 700, color: 'var(--ink-3)' }}>(toque pra copiar)</span></p>
      <div className="mod-gerar">
        <input className="input" value={turma} onChange={(e) => setTurma(e.target.value)} placeholder="Turma (ex.: 6B)" style={{ flex: 1 }} />
        <button className="btn btn-gold btn-sm" onClick={gerar} disabled={gerando}><Icon name="plus" size={16} stroke={2.5} /> Gerar 5</button>
      </div>
      <div className="mod-convites">
        {convites.slice(0, 10).map((c) => (
          <button key={c.codigo} className={`mod-convite ${c.usado ? 'is-usado' : ''}`} onClick={() => !c.usado && copiar(c.codigo)}>
            <code>{c.codigo}</code><span>{c.usado ? `usado${c.usado_por ? ` · ${c.usado_por}` : ''}` : 'disponível'}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
