import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icons';
import { Avatar, Tile, Pill, Wordmark } from '../components/UI';
import { api, setToken, clearToken, getToken } from '../api';
import './AppShell.css';

// Se REACT_APP_API_URL estiver setado, o app usa o backend real.
// Sem ele (preview/artefato), roda em modo demo (dados em memória).
const API_ATIVA = Boolean(process.env.REACT_APP_API_URL);

/* ----------------- dados demo (fallback sem backend) ----------------- */
const DEMO_POSTS = [
  { id: 3, autor: { avatar_inicial: 'B', apelido: 'Bel', avatar_cor: '#E89B00' }, grupo: { nome: 'Grupo do Futebol' }, tempo: '20 min', texto: 'Quem acertar o placar do jogo de sábado leva a figurinha rara. Comenta aí.', reacoes: 12, eu_reagi: false, comentarios: 7, badge: 'craque' },
  { id: 2, autor: { avatar_inicial: 'L', apelido: 'Lucas', avatar_cor: '#2E86C1' }, grupo: { nome: 'Turma 6ºB' }, tempo: '5 min', texto: 'Servidor novo no ar. Quem tá dentro hoje depois da aula?', reacoes: 8, eu_reagi: false, comentarios: 3, photo: true },
  { id: 1, autor: { avatar_inicial: 'T', apelido: 'Théo', avatar_cor: '#5B8C2A' }, grupo: { nome: 'Clube de Alemão' }, tempo: '1 h', texto: 'Descobri que "Freunde" é amigos em alemão. Combina com a gente.', reacoes: 5, eu_reagi: false, comentarios: 2 },
];
const DEMO_GROUPS = [
  { id: 1, nome: 'Turma 6ºB', icone: 'school', tone: 'red', membros: 24, participando: true },
  { id: 2, nome: 'Grupo do Futebol', icone: 'ball', tone: 'blue', membros: 18, participando: true },
  { id: 3, nome: 'Cantinho dos Games', icone: 'gamepad', tone: 'green', membros: 31, participando: false },
  { id: 4, nome: 'Clube de Alemão', icone: 'language', tone: 'gold', membros: 12, participando: false },
  { id: 5, nome: 'Desenho e Arte', icone: 'palette', tone: 'red', membros: 15, participando: false },
];
const TONE_POR_ICONE = { school: 'red', ball: 'blue', gamepad: 'green', language: 'gold', palette: 'red', users: 'red' };

const QUIZ = [
  { q: 'Pomerode é conhecida como a cidade mais ___ do Brasil.', a: ['Alemã', 'Italiana', 'Fria'], correct: 0 },
  { q: 'Como se diz "amigos" em alemão?', a: ['Kinder', 'Freunde', 'Schule'], correct: 1 },
  { q: '"Schule" significa o quê?', a: ['Casa', 'Escola', 'Festa'], correct: 1 },
  { q: 'As casas típicas de Pomerode são no estilo:', a: ['Enxaimel', 'Colonial', 'Moderno'], correct: 0 },
];
const STATUS = ['gamepad', 'ball', 'rocket', 'palette', 'book', 'flame', 'star', 'language'];

export default function AppShell() {
  const nav = useNavigate();
  const [screen, setScreen] = useState('login');
  const [usuario, setUsuario] = useState(null);
  const [tab, setTab] = useState('feed');
  const [toast, setToast] = useState(null);

  const showToast = (t) => { setToast(t); setTimeout(() => setToast(null), 1800); };

  useEffect(() => {
    if (API_ATIVA && getToken()) {
      api.eu().then((u) => { setUsuario(u); setScreen('app'); }).catch(() => clearToken());
    }
  }, []);

  const entrou = (u) => { setUsuario(u); setScreen('app'); setTab('feed'); };
  const sair = () => { clearToken(); setUsuario(null); setScreen('login'); };

  if (screen === 'login') {
    return <Login onEntrar={entrou} onBack={() => nav('/')} toast={toast} showToast={showToast} />;
  }

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
            <button className="app-icon-btn" aria-label="Notificações"><Icon name="bell" size={22} /><span className="app-dot" /></button>
            <button className="app-icon-btn" aria-label="Mensagens"><Icon name="chat" size={22} /></button>
          </div>
        </header>

        <main className="app-screen">
          {tab === 'feed' && <Feed usuario={usuario} showToast={showToast} />}
          {tab === 'grupos' && <Grupos showToast={showToast} />}
          {tab === 'jogos' && <Jogos showToast={showToast} />}
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
            <button key={id} onClick={() => setTab(id)} className={`app-nav-btn ${tab === id ? 'is-active' : ''}`}>
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

/* ----------------------------- LOGIN ----------------------------- */
function Login({ onEntrar, onBack, toast, showToast }) {
  const [modo, setModo] = useState('entrar');
  const [apelido, setApelido] = useState('');
  const [senha, setSenha] = useState('');
  const [codigo, setCodigo] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setErro('');

    if (!API_ATIVA) {
      const ehAdmin = apelido.toLowerCase() === 'diretoraana';
      onEntrar({ apelido: apelido || 'Marco', avatar_inicial: (apelido || 'M')[0].toUpperCase(), avatar_cor: '#C62828', status_icone: 'gamepad', papel: ehAdmin ? 'responsavel' : 'aluno' });
      return;
    }

    try {
      setCarregando(true);
      let res;
      if (modo === 'entrar') {
        if (!apelido.trim() || !senha) { setErro('Preencha apelido e senha.'); setCarregando(false); return; }
        res = await api.entrar(apelido.trim(), senha, 'doutor-blumenau');
      } else {
        if (!codigo.trim() || !apelido.trim()) { setErro('Preencha o código e escolha um apelido.'); setCarregando(false); return; }
        res = await api.resgatar(codigo.trim(), apelido.trim(), senha || undefined);
      }
      setToken(res.token);
      onEntrar(res.usuario);
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
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
          {modo === 'resgatar' && (
            <>
              <label className="login-label" htmlFor="cod">Código de convite</label>
              <input id="cod" className={`input ${erro && !codigo ? 'input--err' : ''}`} value={codigo} onChange={(e) => setCodigo(e.target.value)} placeholder="6B-2026" autoComplete="off" style={{ textAlign: 'center', letterSpacing: '.08em', marginBottom: 12 }} />
            </>
          )}
          <label className="login-label" htmlFor="ap">Apelido</label>
          <input id="ap" className="input" value={apelido} onChange={(e) => setApelido(e.target.value)} placeholder={modo === 'resgatar' ? 'Como quer ser chamado' : 'Marco'} autoComplete="off" style={{ marginBottom: 12 }} />

          <label className="login-label" htmlFor="pw">Senha {modo === 'resgatar' && <span style={{ fontWeight: 700, color: 'var(--ink-3)' }}>(opcional)</span>}</label>
          <input id="pw" type="password" className="input" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="••••••" autoComplete="off" />

          {erro && <p className="login-err">{erro}</p>}

          <button type="submit" className="btn btn-red btn-block" style={{ marginTop: 14 }} disabled={carregando}>
            {carregando ? <><Icon name="refresh" size={18} /> Entrando…</> : <><Icon name={modo === 'resgatar' ? 'ticket' : 'user'} size={18} /> {modo === 'resgatar' ? 'Criar minha conta' : 'Entrar'}</>}
          </button>
          {!API_ATIVA && (
            <button type="button" className="btn btn-ghost btn-block" style={{ marginTop: 10 }} onClick={() => onEntrar({ apelido: 'Marco', avatar_inicial: 'M', avatar_cor: '#C62828', status_icone: 'gamepad', papel: 'aluno' })}>
              Ver a demo
            </button>
          )}
        </form>

        <p className="login-notice"><Icon name="lock" size={14} /> Rede fechada. Só entra quem tem convite da escola.</p>
        <p className="login-credit">Criado por <strong>Thiago Tomelin</strong></p>
      </div>
      {toast && <div className="app-toast"><Icon name="check" size={16} stroke={3} />{toast}</div>}
    </div>
  );
}

/* ----------------------------- FEED ----------------------------- */
function Feed({ usuario, showToast }) {
  const [posts, setPosts] = useState(API_ATIVA ? [] : DEMO_POSTS);
  const [grupos, setGrupos] = useState([]);
  const [draft, setDraft] = useState('');
  const [carregando, setCarregando] = useState(API_ATIVA);
  const [enviando, setEnviando] = useState(false);

  const carregar = useCallback(async () => {
    if (!API_ATIVA) return;
    try {
      setCarregando(true);
      const [f, g] = await Promise.all([api.feed(), api.grupos()]);
      setPosts(f);
      setGrupos(g);
    } catch (e) {
      showToast(e.message);
    } finally {
      setCarregando(false);
    }
  }, [showToast]);

  useEffect(() => { carregar(); }, [carregar]);

  const publicar = async () => {
    if (!draft.trim()) return;
    if (!API_ATIVA) {
      setPosts((p) => [{ id: Date.now(), autor: { avatar_inicial: usuario.avatar_inicial, apelido: usuario.apelido, avatar_cor: usuario.avatar_cor }, grupo: { nome: 'Turma 6ºB' }, tempo: 'agora', texto: draft.trim(), reacoes: 0, eu_reagi: false, comentarios: 0 }, ...p]);
      setDraft(''); showToast('Publicado no mural'); return;
    }
    const grupoAlvo = grupos.find((g) => g.participando) || grupos[0];
    if (!grupoAlvo) { showToast('Entre em um grupo primeiro'); return; }
    try {
      setEnviando(true);
      const novo = await api.criarPost(grupoAlvo.id, draft.trim());
      setPosts((p) => [novo, ...p]);
      setDraft('');
      showToast('Publicado no mural');
    } catch (e) {
      showToast(e.message);
    } finally {
      setEnviando(false);
    }
  };

  const curtir = async (id) => {
    setPosts((p) => p.map((x) => x.id === id ? { ...x, eu_reagi: !x.eu_reagi, reacoes: x.reacoes + (x.eu_reagi ? -1 : 1) } : x));
    if (API_ATIVA) {
      try {
        const r = await api.reagir(id);
        setPosts((p) => p.map((x) => x.id === id ? { ...x, eu_reagi: r.eu_reagi, reacoes: r.reacoes } : x));
      } catch (e) { showToast(e.message); carregar(); }
    }
  };

  const stories = API_ATIVA
    ? posts.slice(0, 6).map((p) => [p.autor.avatar_inicial, p.autor.apelido])
    : [['L', 'Lucas'], ['B', 'Bel'], ['T', 'Théo'], ['H', 'Helena'], ['P', 'Pedro']];

  return (
    <div>
      <div className="stories">
        <div className="story">
          <div className="story-add"><Icon name="plus" size={18} stroke={2.5} /></div>
          <span>Você</span>
        </div>
        {stories.map(([i, n], idx) => (
          <div key={`${n}-${idx}`} className="story"><Avatar initial={i} size={46} ring /><span>{n}</span></div>
        ))}
      </div>

      <div className="composer">
        <Avatar initial={usuario.avatar_inicial} size={40} badgeIcon={usuario.status_icone} />
        <div className="composer-body">
          <textarea className="composer-input" rows={2} value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={`No que você tá pensando, ${usuario.apelido}?`} />
          <div className="composer-actions">
            <div className="composer-tools">
              <button className="app-icon-btn" aria-label="Foto"><Icon name="camera" size={20} /></button>
              <button className="app-icon-btn" aria-label="Reação"><Icon name="smile" size={20} /></button>
            </div>
            <button className="btn btn-red btn-sm" onClick={publicar} disabled={enviando}>{enviando ? 'Enviando…' : <>Postar <Icon name="send" size={15} /></>}</button>
          </div>
        </div>
      </div>

      {carregando && <p className="feed-end">Carregando o mural…</p>}
      {!carregando && posts.length === 0 && <p className="feed-end">Nada por aqui ainda. Seja o primeiro a postar!</p>}

      {posts.map((p) => (
        <article key={p.id} className="post">
          <div className="post-head">
            <Avatar initial={p.autor.avatar_inicial} size={42} />
            <div className="post-who">
              <strong>{p.autor.apelido}{p.badge && <span className="post-badge"><Icon name="medal" size={11} stroke={2.5} />{p.badge}</span>}</strong>
              <span>{p.grupo?.nome} · {p.tempo}</span>
            </div>
            <button className="app-icon-btn" aria-label="Mais"><Icon name="dots" size={20} /></button>
          </div>
          <p className="post-text">{p.texto}</p>
          {p.photo && <div className="post-photo"><Icon name="photo" size={28} /></div>}
          <div className="post-actions">
            <Pill icon="heart" active={p.eu_reagi} onClick={() => curtir(p.id)}>{p.reacoes}</Pill>
            <Pill icon="comment">{p.comentarios}</Pill>
            <Pill icon="send" />
          </div>
        </article>
      ))}
      {!carregando && posts.length > 0 && <p className="feed-end">Você viu tudo por aqui.</p>}
    </div>
  );
}

/* ----------------------------- GRUPOS ----------------------------- */
function Grupos({ showToast }) {
  const [grupos, setGrupos] = useState(API_ATIVA ? [] : DEMO_GROUPS);
  const [carregando, setCarregando] = useState(API_ATIVA);

  const carregar = useCallback(async () => {
    if (!API_ATIVA) return;
    try {
      setCarregando(true);
      const g = await api.grupos();
      setGrupos(g.map((x) => ({ ...x, tone: TONE_POR_ICONE[x.icone] || 'red' })));
    } catch (e) { showToast(e.message); } finally { setCarregando(false); }
  }, [showToast]);

  useEffect(() => { carregar(); }, [carregar]);

  const alternar = async (g) => {
    setGrupos((gs) => gs.map((x) => x.id === g.id ? { ...x, participando: !x.participando, membros: x.membros + (x.participando ? -1 : 1) } : x));
    if (API_ATIVA) {
      try { g.participando ? await api.sairGrupo(g.id) : await api.entrarGrupo(g.id); }
      catch (e) { showToast(e.message); carregar(); }
    }
  };

  return (
    <div className="pad">
      <h2 className="h2">Grupos</h2>
      <p className="sub">Cada grupo tem seu próprio mural.</p>
      {carregando && <p className="feed-end">Carregando…</p>}
      {grupos.map((g) => (
        <div key={g.id} className="row-card">
          <Tile icon={g.icone} tone={g.tone || 'red'} size={48} radius={14} />
          <div className="row-card-body">
            <strong>{g.nome}</strong>
            <span>{g.membros} colegas</span>
          </div>
          <button onClick={() => alternar(g)} className={`btn btn-sm ${g.participando ? 'btn-ghost' : 'btn-red'}`}>
            {g.participando ? <><Icon name="check" size={15} stroke={3} /> Dentro</> : 'Entrar'}
          </button>
        </div>
      ))}
      <button className="btn btn-gold btn-block" style={{ marginTop: 6 }} onClick={() => showToast('Em breve')}><Icon name="plus" size={18} stroke={2.5} /> Criar grupo</button>
    </div>
  );
}

/* ----------------------------- DESAFIOS ----------------------------- */
function Jogos({ showToast }) {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const reset = () => { setI(0); setPicked(null); setScore(0); setDone(false); };

  if (done) return (
    <div className="pad" style={{ textAlign: 'center', paddingTop: 40 }}>
      <div className="result-tile"><Icon name={score >= 3 ? 'trophy' : 'sparkles'} size={44} stroke={2} /></div>
      <h2 className="h2" style={{ marginTop: 18 }}>{score} de {QUIZ.length}</h2>
      <p className="sub">{score >= 3 ? 'Mandou muito bem, craque de Pomerode.' : 'Boa tentativa. Bora de novo?'}</p>
      <button className="btn btn-red" style={{ marginTop: 18 }} onClick={reset}><Icon name="refresh" size={18} /> Jogar de novo</button>
    </div>
  );

  const q = QUIZ[i];
  const next = () => {
    if (picked === null) return;
    if (picked === q.correct) setScore((s) => s + 1);
    if (i + 1 >= QUIZ.length) setDone(true); else { setI(i + 1); setPicked(null); }
  };

  return (
    <div className="pad">
      <h2 className="h2">Desafios</h2>
      <p className="sub">Sobe no ranking da turma.</p>

      <div className="quiz fachwerk">
        <div className="quiz-head">
          <span className="quiz-title"><Icon name="bulb" size={16} stroke={2.5} /> Quiz de Pomerode</span>
          <span className="quiz-prog">{i + 1}/{QUIZ.length}</span>
        </div>
        <p className="quiz-q">{q.q}</p>
        <div className="quiz-opts">
          {q.a.map((opt, idx) => {
            const reveal = picked !== null, correct = idx === q.correct, mine = picked === idx;
            const cls = `quiz-opt ${reveal && correct ? 'is-correct' : ''} ${reveal && mine && !correct ? 'is-wrong' : ''}`;
            return (
              <button key={idx} className={cls} onClick={() => picked === null && setPicked(idx)}>
                {opt}
                {reveal && correct && <Icon name="check" size={18} stroke={3} />}
                {reveal && mine && !correct && <Icon name="x" size={18} stroke={3} />}
              </button>
            );
          })}
        </div>
        <button className="btn btn-red btn-block" style={{ marginTop: 14 }} onClick={next} disabled={picked === null}>
          {i + 1 >= QUIZ.length ? 'Ver resultado' : 'Próxima'} <Icon name="arrowRight" size={18} />
        </button>
      </div>

      <p className="label">Mais pra jogar</p>
      {[['ball', 'blue', 'Adivinha o placar', 'Chute o resultado do jogo de sábado'], ['palette', 'red', 'Desenho do dia', 'Um tema novo por dia'], ['language', 'gold', 'Palavra em alemão', 'Aprenda e desafie um amigo']].map(([ic, tone, t, d]) => (
        <button key={t} className="row-card row-card--btn" onClick={() => showToast('Em breve')}>
          <Tile icon={ic} tone={tone} size={44} />
          <div className="row-card-body"><strong>{t}</strong><span>{d}</span></div>
          <Icon name="chevronRight" size={20} style={{ color: 'var(--ink-3)' }} />
        </button>
      ))}
    </div>
  );
}

/* ----------------------------- PERFIL ----------------------------- */
function Perfil({ usuario, setUsuario, onLogout }) {
  const [dados, setDados] = useState(null);
  const [status, setStatusLocal] = useState(usuario.status_icone || 'gamepad');
  const badges = [['medal', 'gold', 'Craque da semana'], ['flame', 'red', '7 dias seguidos'], ['bulb', 'blue', 'Quiz 4/4'], ['users', 'green', '5 amigos']];

  useEffect(() => {
    if (API_ATIVA) api.perfil().then(setDados).catch(() => {});
  }, []);

  const trocarStatus = async (s) => {
    setStatusLocal(s);
    setUsuario({ ...usuario, status_icone: s });
    if (API_ATIVA) { try { await api.atualizarPerfil({ status_icone: s }); } catch (e) { /* silencioso */ } }
  };

  const stats = dados?.stats || { posts: 0, curtidas: 0, grupos: 0 };
  const medalhas = dados?.medalhas?.length ? dados.medalhas : null;

  return (
    <div>
      <div className="profile-hero fachwerk">
        <div className="profile-avatar"><Avatar initial={usuario.avatar_inicial} size={88} badgeIcon={status} /></div>
        <h2 className="h2" style={{ marginTop: 10 }}>{usuario.apelido}</h2>
        <p className="profile-school">{dados?.escola || 'Escola Doutor Blumenau'} · Pomerode</p>
      </div>
      <div className="stats">
        {[[stats.posts, 'Posts'], [stats.curtidas, 'Curtidas'], [stats.grupos, 'Grupos']].map(([n, l]) => (
          <div key={l} className="stat"><strong>{n}</strong><span>{l}</span></div>
        ))}
      </div>
      <div className="pad">
        <p className="label">Status do dia</p>
        <div className="status-grid">
          {STATUS.map((s) => (
            <button key={s} onClick={() => trocarStatus(s)} className={`status-btn ${status === s ? 'is-active' : ''}`} aria-label={s}><Icon name={s} size={22} /></button>
          ))}
        </div>
        <p className="label" style={{ marginTop: 22 }}>Conquistas</p>
        <div className="badges">
          {(medalhas || badges.map(([icone, , titulo]) => ({ icone, titulo }))).map((m, idx) => {
            const tone = badges[idx % badges.length][1];
            return (
              <div key={m.titulo || idx} className="badge-card"><Tile icon={m.icone || 'medal'} tone={tone} size={36} radius={10} /><span>{m.titulo}</span></div>
            );
          })}
        </div>
        <button className="btn btn-ghost btn-block" style={{ marginTop: 22 }} onClick={onLogout}><Icon name="logout" size={18} /> Sair</button>
        <p className="profile-credit">Criado por <strong>Thiago Tomelin</strong></p>
      </div>
    </div>
  );
}

/* ----------------------------- MODERAR (responsável) ----------------------------- */
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
    try {
      const [p, d, c] = await Promise.all([api.admin.painel(), api.admin.denuncias(), api.admin.convites()]);
      setPainel(p); setDenuncias(d); setConvites(c);
    } catch (e) { showToast(e.message); }
  }, [showToast]);

  useEffect(() => { carregar(); }, [carregar]);

  const resolver = async (id, acao) => {
    setDenuncias((ds) => ds.filter((d) => d.id !== id));
    if (API_ATIVA) { try { await api.admin.resolverDenuncia(id, acao); } catch (e) { showToast(e.message); carregar(); } }
    showToast(acao === 'ocultar' ? 'Post ocultado' : 'Denúncia descartada');
  };

  const gerar = async () => {
    if (!API_ATIVA) { showToast('Convites gerados (demo)'); return; }
    try {
      setGerando(true);
      const novos = await api.admin.gerarConvites(turma, 5);
      setConvites((c) => [...novos.map((n) => ({ ...n, usado: false })), ...c]);
      showToast(`${novos.length} convites gerados`);
    } catch (e) { showToast(e.message); } finally { setGerando(false); }
  };

  return (
    <div className="pad">
      <h2 className="h2">Painel do responsável</h2>
      <p className="sub">Acompanhe e modere a rede da escola.</p>

      <div className="mod-stats">
        {[
          ['users', 'Alunos', painel?.alunos ?? '—'],
          ['ticket', 'Convites usados', painel?.convites_usados ?? '—'],
          ['grid', 'Posts na semana', painel?.posts_semana ?? '—'],
          ['flag', 'Denúncias', painel?.denuncias_abertas ?? denuncias.length],
        ].map(([ic, lb, v]) => (
          <div key={lb} className="mod-stat">
            <Tile icon={ic} tone="ink" size={34} radius={10} />
            <div><strong>{v}</strong><span>{lb}</span></div>
          </div>
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

      <p className="label" style={{ marginTop: 22 }}>Convites</p>
      <div className="mod-gerar">
        <input className="input" value={turma} onChange={(e) => setTurma(e.target.value)} placeholder="Turma (ex.: 6B)" style={{ flex: 1 }} />
        <button className="btn btn-gold btn-sm" onClick={gerar} disabled={gerando}><Icon name="plus" size={16} stroke={2.5} /> Gerar 5</button>
      </div>
      <div className="mod-convites">
        {convites.slice(0, 8).map((c) => (
          <div key={c.codigo} className={`mod-convite ${c.usado ? 'is-usado' : ''}`}>
            <code>{c.codigo}</code>
            <span>{c.usado ? `usado${c.usado_por ? ` · ${c.usado_por}` : ''}` : 'disponível'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
