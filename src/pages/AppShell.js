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
  const [painel, setPainel] = useState(null); // 'notif' | null
  const [postarTema, setPostarTema] = useState('');

  const showToast = useCallback((t) => { setToast(t); setTimeout(() => setToast(null), 2000); }, []);

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
            <button className={`app-icon-btn ${painel === 'notif' ? 'is-on' : ''}`} aria-label="Notificações" onClick={() => setPainel(painel === 'notif' ? null : 'notif')}>
              <Icon name="bell" size={22} /><span className="app-dot" />
            </button>
            <button className="app-icon-btn" aria-label="Ranking" onClick={() => setTab('ranking')}><Icon name="trophy" size={22} /></button>
          </div>
        </header>

        {painel === 'notif' && <Notificacoes fechar={() => setPainel(null)} />}

        <main className="app-screen">
          {tab === 'feed' && <Feed usuario={usuario} showToast={showToast} temaInicial={postarTema} limparTema={() => setPostarTema('')} />}
          {tab === 'grupos' && <Grupos showToast={showToast} />}
          {tab === 'jogos' && <Jogos showToast={showToast} usuario={usuario} setUsuario={setUsuario} irPostar={irPostar} />}
          {tab === 'ranking' && <Ranking usuario={usuario} />}
          {tab === 'perfil' && <Perfil usuario={usuario} setUsuario={setUsuario} onLogout={sair} />}
          {tab === 'moderar' && ehModerador && <Moderar showToast={showToast} />}
        </main>

        <nav className="app-nav">
          {[
            ['feed', 'home', 'Mural'],
            ['grupos', 'users', 'Grupos'],
            ['jogos', 'gamepad', 'Desafios'],
            ...(ehModerador ? [['moderar', 'shield', 'Moderar']] : []),
            ['perfil', 'user', 'Perfil'],
          ].map(([id, ic, lb]) => (
            <button key={id} onClick={() => { setTab(id); setPainel(null); }} className={`app-nav-btn ${tab === id ? 'is-active' : ''}`}>
              <Icon name={ic} size={22} stroke={tab === id ? 2.5 : 2} />
              <span>{lb}</span>
            </button>
          ))}
        </nav>

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
function Feed({ usuario, showToast, temaInicial, limparTema }) {
  const [posts, setPosts] = useState(API_ATIVA ? [] : DEMO_POSTS);
  const [draft, setDraft] = useState('');
  const [carregando, setCarregando] = useState(API_ATIVA);
  const [enviando, setEnviando] = useState(false);
  const [aberto, setAberto] = useState(null);   // post com comentários abertos
  const [menu, setMenu] = useState(null);       // post com menu "..." aberto

  useEffect(() => { if (temaInicial) { setDraft(temaInicial); limparTema(); } }, [temaInicial, limparTema]);

  const carregar = useCallback(async () => {
    if (!API_ATIVA) return;
    try { setCarregando(true); setPosts(await api.feed()); }
    catch (e) { showToast(e.message); } finally { setCarregando(false); }
  }, [showToast]);
  useEffect(() => { carregar(); }, [carregar]);

  const publicar = async () => {
    if (!draft.trim()) return;
    if (!API_ATIVA) {
      setPosts((p) => [{ id: Date.now(), autor: { id: usuario.id, avatar_inicial: usuario.avatar_inicial, apelido: usuario.apelido }, grupo: { nome: 'Turma 6ºB' }, tempo: 'agora', texto: draft.trim(), reacoes: 0, eu_reagi: false, comentarios: 0 }, ...p]);
      setDraft(''); showToast('Publicado no mural'); return;
    }
    try { setEnviando(true); const novo = await api.criarPost(null, draft.trim()); setPosts((p) => [novo, ...p]); setDraft(''); showToast('Publicado no mural'); }
    catch (e) { showToast(e.message); } finally { setEnviando(false); }
  };

  const curtir = async (id) => {
    setPosts((p) => p.map((x) => x.id === id ? { ...x, eu_reagi: !x.eu_reagi, reacoes: x.reacoes + (x.eu_reagi ? -1 : 1) } : x));
    if (API_ATIVA) { try { const r = await api.reagir(id); setPosts((p) => p.map((x) => x.id === id ? { ...x, eu_reagi: r.eu_reagi, reacoes: r.reacoes } : x)); } catch (e) { showToast(e.message); carregar(); } }
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
  const stories = API_ATIVA ? [...new Map(posts.map((p) => [p.autor.apelido, p.autor])).values()].slice(0, 6) : [{ avatar_inicial: 'L', apelido: 'Lucas' }, { avatar_inicial: 'B', apelido: 'Bel' }, { avatar_inicial: 'T', apelido: 'Théo' }, { avatar_inicial: 'H', apelido: 'Helena' }];

  return (
    <div onClick={() => menu && setMenu(null)}>
      <div className="stories">
        <div className="story"><div className="story-add"><Icon name="plus" size={18} stroke={2.5} /></div><span>Você</span></div>
        {stories.map((a) => <div key={a.apelido} className="story"><Avatar initial={a.avatar_inicial} size={46} ring /><span>{a.apelido}</span></div>)}
      </div>

      <div className="composer">
        <Avatar initial={usuario.avatar_inicial} size={40} badgeIcon={usuario.status_icone} />
        <div className="composer-body">
          <textarea className="composer-input" rows={2} value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={`No que você tá pensando, ${usuario.apelido}?`} />
          <div className="composer-actions">
            <div className="composer-tools">
              <button className="app-icon-btn" aria-label="Foto" onClick={() => showToast('Fotos chegam na próxima versão')}><Icon name="camera" size={20} /></button>
            </div>
            <button className="btn btn-red btn-sm" onClick={publicar} disabled={enviando}>{enviando ? 'Enviando…' : <>Postar <Icon name="send" size={15} /></>}</button>
          </div>
        </div>
      </div>

      {carregando && <p className="feed-end">Carregando o mural…</p>}
      {!carregando && posts.length === 0 && <p className="feed-end">Nada por aqui ainda. Seja o primeiro a postar!</p>}

      {posts.map((p) => {
        const meu = p.autor?.id === usuario.id || p.autor?.apelido === usuario.apelido;
        return (
          <article key={p.id} className="post">
            <div className="post-head">
              <Avatar initial={p.autor.avatar_inicial} size={42} />
              <div className="post-who">
                <strong>{p.autor.apelido}{p.badge && <span className="post-badge"><Icon name="medal" size={11} stroke={2.5} />{p.badge}</span>}</strong>
                <span>{p.grupo?.nome} · {p.tempo}</span>
              </div>
              <div className="post-menu-wrap" onClick={(e) => e.stopPropagation()}>
                <button className="app-icon-btn" aria-label="Mais" onClick={() => setMenu(menu === p.id ? null : p.id)}><Icon name="dots" size={20} /></button>
                {menu === p.id && (
                  <div className="post-menu">
                    {(meu || ehModerador) && <button onClick={() => remover(p.id)}><Icon name="x" size={16} /> Remover post</button>}
                    {!meu && <button onClick={() => denunciar(p.id)}><Icon name="flag" size={16} /> Denunciar</button>}
                  </div>
                )}
              </div>
            </div>
            <p className="post-text">{p.texto}</p>
            {p.photo && <div className="post-photo"><Icon name="photo" size={28} /></div>}
            <div className="post-actions">
              <Pill icon="heart" active={p.eu_reagi} onClick={() => curtir(p.id)}>{p.reacoes}</Pill>
              <Pill icon="comment" tone={aberto === p.id ? 'gold' : 'neutral'} onClick={() => setAberto(aberto === p.id ? null : p.id)}>{p.comentarios}</Pill>
            </div>
            {aberto === p.id && <Comentarios post={p} usuario={usuario} showToast={showToast} onNovo={() => setPosts((ps) => ps.map((x) => x.id === p.id ? { ...x, comentarios: x.comentarios + 1 } : x))} />}
          </article>
        );
      })}
      {!carregando && posts.length > 0 && <p className="feed-end">Você viu tudo por aqui.</p>}
    </div>
  );
}

function Comentarios({ post, usuario, showToast, onNovo }) {
  const [lista, setLista] = useState(API_ATIVA ? null : (DEMO_COMENTARIOS[post.id] || []));
  const [texto, setTexto] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => { if (API_ATIVA) api.comentarios(post.id).then(setLista).catch(() => setLista([])); }, [post.id]);

  const enviar = async () => {
    if (!texto.trim()) return;
    if (!API_ATIVA) { setLista((l) => [...l, { id: Date.now(), autor: { avatar_inicial: usuario.avatar_inicial, apelido: usuario.apelido }, texto: texto.trim() }]); setTexto(''); onNovo(); return; }
    try { setEnviando(true); const c = await api.comentar(post.id, texto.trim()); setLista((l) => [...(l || []), c]); setTexto(''); onNovo(); }
    catch (e) { showToast(e.message); } finally { setEnviando(false); }
  };

  return (
    <div className="coments" onClick={(e) => e.stopPropagation()}>
      {lista === null && <p className="coments-empty">Carregando…</p>}
      {lista && lista.length === 0 && <p className="coments-empty">Seja o primeiro a comentar.</p>}
      {lista && lista.map((c) => (
        <div key={c.id} className="coment"><Avatar initial={c.autor.avatar_inicial} size={28} /><div><strong>{c.autor.apelido}</strong><p>{c.texto}</p></div></div>
      ))}
      <div className="coment-form">
        <input className="input" value={texto} onChange={(e) => setTexto(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && enviar()} placeholder="Escreva um comentário…" />
        <button className="btn btn-red btn-sm" onClick={enviar} disabled={enviando}><Icon name="send" size={15} /></button>
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
function Ranking({ usuario }) {
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
        <div key={r.posicao} className={`rank-row ${r.eu ? 'is-me' : ''}`}>
          <div className="rank-pos">{medalha(r.posicao) ? <Tile icon="medal" tone={medalha(r.posicao)} size={30} radius={9} /> : <span>{r.posicao}</span>}</div>
          <Avatar initial={r.usuario.avatar_inicial} size={36} />
          <strong className="rank-nome">{r.usuario.apelido}{r.eu && <em> (você)</em>}</strong>
          <span className="rank-pts">{r.pontos} pts</span>
        </div>
      ))}
    </div>
  );
}

/* ===================== PERFIL ===================== */
function Perfil({ usuario, setUsuario, onLogout }) {
  const [dados, setDados] = useState(null);
  const [status, setStatusLocal] = useState(usuario.status_icone || 'gamepad');
  useEffect(() => { if (API_ATIVA) api.perfil().then(setDados).catch(() => {}); }, []);
  const trocarStatus = async (s) => { setStatusLocal(s); setUsuario({ ...usuario, status_icone: s }); if (API_ATIVA) { try { await api.atualizarPerfil({ status_icone: s }); } catch (e) { /* */ } } };
  const stats = dados?.stats || { posts: 0, curtidas: 0, pontos: usuario.pontos ?? 0, ranking: '-' };
  const medalhas = dados?.medalhas?.length ? dados.medalhas : (API_ATIVA ? [] : [{ icone: 'medal', titulo: 'Craque da semana' }, { icone: 'flame', titulo: '7 dias seguidos' }, { icone: 'bulb', titulo: 'Quiz perfeito' }, { icone: 'users', titulo: '5 amigos' }]);
  const tones = ['gold', 'red', 'blue', 'green'];
  return (
    <div>
      <div className="profile-hero fachwerk">
        <div className="profile-avatar"><Avatar initial={usuario.avatar_inicial} size={88} badgeIcon={status} /></div>
        <h2 className="h2" style={{ marginTop: 10 }}>{usuario.apelido}</h2>
        <p className="profile-school">{dados?.escola || 'Escola Doutor Blumenau'} · Pomerode</p>
      </div>
      <div className="stats">
        {[[stats.posts, 'Posts'], [stats.curtidas, 'Curtidas'], [stats.pontos, 'Pontos'], [`${stats.ranking}º`, 'Ranking']].map(([n, l]) => <div key={l} className="stat"><strong>{n}</strong><span>{l}</span></div>)}
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
