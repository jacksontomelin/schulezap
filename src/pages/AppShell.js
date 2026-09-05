import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icons';
import { Avatar, Tile, Pill, Wordmark } from '../components/UI';
import './AppShell.css';

const SEED_POSTS = [
  { id: 3, initial: 'B', name: 'Bel',   group: 'Grupo do Futebol', time: '20 min', text: 'Quem acertar o placar do jogo de sábado leva a figurinha rara. Comenta aí.', likes: 12, liked: false, comments: 7, badge: 'craque' },
  { id: 2, initial: 'L', name: 'Lucas', group: 'Turma 6ºB',        time: '5 min',  text: 'Servidor novo no ar. Quem tá dentro hoje depois da aula?', likes: 8, liked: false, comments: 3, photo: true },
  { id: 1, initial: 'T', name: 'Théo',  group: 'Clube de Alemão',  time: '1 h',    text: 'Descobri que "Freunde" é amigos em alemão. Combina com a gente.', likes: 5, liked: false, comments: 2 },
];

const GROUPS = [
  { name: 'Turma 6ºB',          icon: 'school',   tone: 'red',   members: 24, joined: true },
  { name: 'Grupo do Futebol',   icon: 'ball',     tone: 'blue',  members: 18, joined: true },
  { name: 'Cantinho dos Games', icon: 'gamepad',  tone: 'green', members: 31, joined: false },
  { name: 'Clube de Alemão',    icon: 'language', tone: 'gold',  members: 12, joined: false },
  { name: 'Desenho e Arte',     icon: 'palette',  tone: 'red',   members: 15, joined: false },
];

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
  const [tab, setTab] = useState('feed');
  const [posts, setPosts] = useState(SEED_POSTS);
  const [draft, setDraft] = useState('');
  const [groups, setGroups] = useState(GROUPS);
  const [status, setStatus] = useState('gamepad');
  const [toast, setToast] = useState(null);

  const showToast = (t) => { setToast(t); setTimeout(() => setToast(null), 1800); };
  const like = (id) => setPosts(p => p.map(x => x.id === id ? { ...x, liked: !x.liked, likes: x.likes + (x.liked ? -1 : 1) } : x));
  const publish = () => {
    if (!draft.trim()) return;
    setPosts(p => [{ id: Date.now(), initial: 'M', name: 'Marco', group: 'Turma 6ºB', time: 'agora', text: draft.trim(), likes: 0, liked: false, comments: 0 }, ...p]);
    setDraft(''); showToast('Publicado no mural');
  };
  const toggleGroup = (name) => setGroups(g => g.map(x => x.name === name ? { ...x, joined: !x.joined, members: x.members + (x.joined ? -1 : 1) } : x));

  if (screen === 'login') return <Login onEnter={() => setScreen('app')} onBack={() => nav('/')} />;

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
          {tab === 'feed'   && <Feed posts={posts} draft={draft} setDraft={setDraft} publish={publish} like={like} status={status} />}
          {tab === 'grupos' && <Grupos groups={groups} toggle={toggleGroup} showToast={showToast} />}
          {tab === 'jogos'  && <Jogos showToast={showToast} />}
          {tab === 'perfil' && <Perfil posts={posts} status={status} setStatus={setStatus} onLogout={() => setScreen('login')} />}
        </main>

        <nav className="app-nav">
          {[['feed', 'home', 'Mural'], ['grupos', 'users', 'Grupos'], ['jogos', 'gamepad', 'Desafios'], ['perfil', 'user', 'Perfil']].map(([id, ic, lb]) => (
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

/* ---------------- LOGIN ---------------- */
function Login({ onEnter, onBack }) {
  const [code, setCode] = useState('');
  const [err, setErr] = useState(false);
  const submit = (e) => { e.preventDefault(); if (code.trim()) onEnter(); else setErr(true); };
  return (
    <div className="login fachwerk">
      <button className="login-back" onClick={onBack}><Icon name="arrowLeft" size={18} /> Voltar</button>
      <div className="login-card">
        <img src="/logo.png" alt="SchuleZap" className="login-logo" />
        <Wordmark size={34} />
        <p className="login-sub">Rede Social Escolar de Pomerode, SC</p>
        <p className="login-tag">Nossa Pequena Alemanha.</p>

        <form className="login-form" onSubmit={submit}>
          <label className="login-label" htmlFor="code">Código de convite</label>
          <input id="code" className={`input ${err ? 'input--err' : ''}`} value={code} onChange={e => { setCode(e.target.value); setErr(false); }} placeholder="6B-2026" autoComplete="off" style={{ textAlign: 'center', letterSpacing: '.08em' }} />
          {err && <p className="login-err">Digite o código que a escola te deu.</p>}
          <button type="submit" className="btn btn-red btn-block" style={{ marginTop: 12 }}><Icon name="ticket" size={18} /> Entrar</button>
          <button type="button" className="btn btn-ghost btn-block" style={{ marginTop: 10 }} onClick={onEnter}>Ver a demo como Marco</button>
        </form>

        <p className="login-notice"><Icon name="lock" size={14} /> Rede fechada. Só entra quem tem convite da escola.</p>
        <p className="login-credit">Criado por <strong>Thiago Tomelin</strong></p>
      </div>
    </div>
  );
}

/* ---------------- FEED ---------------- */
function Feed({ posts, draft, setDraft, publish, like, status }) {
  return (
    <div>
      <div className="stories">
        <div className="story">
          <div className="story-add"><Icon name="plus" size={18} stroke={2.5} /></div>
          <span>Você</span>
        </div>
        {[['L', 'Lucas'], ['B', 'Bel'], ['T', 'Théo'], ['H', 'Helena'], ['P', 'Pedro']].map(([i, n]) => (
          <div key={n} className="story"><Avatar initial={i} size={46} ring /><span>{n}</span></div>
        ))}
      </div>

      <div className="composer">
        <Avatar initial="M" size={40} badgeIcon={status} />
        <div className="composer-body">
          <textarea className="composer-input" rows={2} value={draft} onChange={e => setDraft(e.target.value)} placeholder="No que você tá pensando, Marco?" />
          <div className="composer-actions">
            <div className="composer-tools">
              <button className="app-icon-btn" aria-label="Foto"><Icon name="camera" size={20} /></button>
              <button className="app-icon-btn" aria-label="Reação"><Icon name="smile" size={20} /></button>
            </div>
            <button className="btn btn-red btn-sm" onClick={publish}>Postar <Icon name="send" size={15} /></button>
          </div>
        </div>
      </div>

      {posts.map(p => (
        <article key={p.id} className="post">
          <div className="post-head">
            <Avatar initial={p.initial} size={42} />
            <div className="post-who">
              <strong>{p.name}{p.badge && <span className="post-badge"><Icon name="medal" size={11} stroke={2.5} />{p.badge}</span>}</strong>
              <span>{p.group} · {p.time}</span>
            </div>
            <button className="app-icon-btn" aria-label="Mais"><Icon name="dots" size={20} /></button>
          </div>
          <p className="post-text">{p.text}</p>
          {p.photo && <div className="post-photo"><Icon name="photo" size={28} /></div>}
          <div className="post-actions">
            <Pill icon="heart" active={p.liked} onClick={() => like(p.id)}>{p.likes}</Pill>
            <Pill icon="comment">{p.comments}</Pill>
            <Pill icon="send" />
          </div>
        </article>
      ))}
      <p className="feed-end">Você viu tudo por aqui.</p>
    </div>
  );
}

/* ---------------- GRUPOS ---------------- */
function Grupos({ groups, toggle, showToast }) {
  return (
    <div className="pad">
      <h2 className="h2">Grupos</h2>
      <p className="sub">Cada grupo tem seu próprio mural.</p>
      {groups.map(g => (
        <div key={g.name} className="row-card">
          <Tile icon={g.icon} tone={g.tone} size={48} radius={14} />
          <div className="row-card-body">
            <strong>{g.name}</strong>
            <span>{g.members} colegas</span>
          </div>
          <button onClick={() => toggle(g.name)} className={`btn btn-sm ${g.joined ? 'btn-ghost' : 'btn-red'}`}>
            {g.joined ? <><Icon name="check" size={15} stroke={3} /> Dentro</> : 'Entrar'}
          </button>
        </div>
      ))}
      <button className="btn btn-gold btn-block" style={{ marginTop: 6 }} onClick={() => showToast('Em breve')}><Icon name="plus" size={18} stroke={2.5} /> Criar grupo</button>
    </div>
  );
}

/* ---------------- DESAFIOS ---------------- */
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
    if (picked === q.correct) setScore(s => s + 1);
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

/* ---------------- PERFIL ---------------- */
function Perfil({ posts, status, setStatus, onLogout }) {
  const mine = posts.filter(p => p.initial === 'M');
  const likes = mine.reduce((s, p) => s + p.likes, 0);
  const badges = [['medal', 'gold', 'Craque da semana'], ['flame', 'red', '7 dias seguidos'], ['bulb', 'blue', 'Quiz 4/4'], ['users', 'green', '5 amigos']];
  return (
    <div>
      <div className="profile-hero fachwerk">
        <div className="profile-avatar"><Avatar initial="M" size={88} badgeIcon={status} /></div>
        <h2 className="h2" style={{ marginTop: 10 }}>Marco</h2>
        <p className="profile-school">6ºB · Escola Doutor Blumenau · Pomerode</p>
      </div>
      <div className="stats">
        {[[mine.length, 'Posts'], [likes, 'Curtidas'], ['#3', 'Ranking']].map(([n, l]) => (
          <div key={l} className="stat"><strong>{n}</strong><span>{l}</span></div>
        ))}
      </div>
      <div className="pad">
        <p className="label">Status do dia</p>
        <div className="status-grid">
          {STATUS.map(s => (
            <button key={s} onClick={() => setStatus(s)} className={`status-btn ${status === s ? 'is-active' : ''}`} aria-label={s}><Icon name={s} size={22} /></button>
          ))}
        </div>
        <p className="label" style={{ marginTop: 22 }}>Conquistas</p>
        <div className="badges">
          {badges.map(([ic, tone, t]) => (
            <div key={t} className="badge-card"><Tile icon={ic} tone={tone} size={36} radius={10} /><span>{t}</span></div>
          ))}
        </div>
        <button className="btn btn-ghost btn-block" style={{ marginTop: 22 }} onClick={onLogout}><Icon name="logout" size={18} /> Sair</button>
        <p className="profile-credit">Criado por <strong>Thiago Tomelin</strong></p>
      </div>
    </div>
  );
}
