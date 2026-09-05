import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AppShell.css';

const C = {
  gold: '#F7B500', goldDeep: '#E89B00', goldSoft: '#FCD34D',
  red: '#C62828', redDeep: '#8E1B1B', redSoft: '#F8D7D3',
  blue: '#2E86C1', cream: '#FFF8E7', ink: '#3A2A0C', inkSoft: '#8A7A55', line: '#F0DFA8',
};

const AVATARS = {
  MA: { bg: '#C62828', fg: '#fff' }, LU: { bg: '#2E86C1', fg: '#fff' },
  BE: { bg: '#E89B00', fg: '#3A2A0C' }, TH: { bg: '#5B8C2A', fg: '#fff' },
  HE: { bg: '#8E44AD', fg: '#fff' }, PA: { bg: '#2E86C1', fg: '#fff' },
};
function Avatar({ id, size = 40, emoji }) {
  const a = AVATARS[id] || { bg: C.goldDeep, fg: '#fff' };
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <div style={{ width: size, height: size, borderRadius: '50%', background: a.bg, color: a.fg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: size * 0.36, boxShadow: 'inset 0 2px 4px rgba(255,255,255,.35), 0 1px 3px rgba(0,0,0,.15)' }}>{id}</div>
      {emoji && <div style={{ position: 'absolute', bottom: -2, right: -2, fontSize: size * 0.38, filter: 'drop-shadow(0 1px 1px rgba(0,0,0,.2))' }}>{emoji}</div>}
    </div>
  );
}

const SEED_POSTS = [
  { id: 3, who: 'BE', name: 'Bel', group: 'Grupo do Futebol', time: 'há 20 min', text: 'Quem acertar o placar do jogo de sábado ganha figurinha rara 🏆 comenta aí!', likes: 12, liked: false, comments: 7, badge: 'craque da semana' },
  { id: 2, who: 'LU', name: 'Lucas', group: 'Turma 6ºB', time: 'há 5 min', text: 'Alguém pra jogar depois da aula hoje? Montei um servidor novo 👾', likes: 8, liked: false, comments: 3, photo: true },
  { id: 1, who: 'TH', name: 'Théo', group: 'Clube de Alemão', time: 'há 1 h', text: 'Aprendi que "Freunde" é amigos em alemão. Combina com a gente 😄', likes: 5, liked: false, comments: 2 },
];

const GROUPS = [
  { name: 'Turma 6ºB', emoji: '🏫', members: 24, color: C.red, joined: true },
  { name: 'Grupo do Futebol', emoji: '⚽', members: 18, color: C.blue, joined: true },
  { name: 'Cantinho dos Games', emoji: '🎮', members: 31, color: '#5B8C2A', joined: false },
  { name: 'Clube de Alemão', emoji: '🇩🇪', members: 12, color: C.goldDeep, joined: false },
  { name: 'Desenho e Arte', emoji: '🎨', members: 15, color: '#8E44AD', joined: false },
];

const QUIZ = [
  { q: 'Pomerode é conhecida como a cidade mais ___ do Brasil.', a: ['Alemã', 'Italiana', 'Fria'], correct: 0 },
  { q: 'Como se diz "amigos" em alemão?', a: ['Kinder', 'Freunde', 'Schule'], correct: 1 },
  { q: '"Schule" significa o quê?', a: ['Casa', 'Escola', 'Festa'], correct: 1 },
  { q: 'As casinhas típicas de Pomerode são no estilo:', a: ['Enxaimel', 'Colonial', 'Moderno'], correct: 0 },
];

export default function AppShell() {
  const nav = useNavigate();
  const [screen, setScreen] = useState('login');
  const [tab, setTab] = useState('feed');
  const [posts, setPosts] = useState(SEED_POSTS);
  const [draft, setDraft] = useState('');
  const [groups, setGroups] = useState(GROUPS);
  const [statusEmoji, setStatusEmoji] = useState('🎮');
  const [code, setCode] = useState('');
  const [codeErr, setCodeErr] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (t) => { setToast(t); setTimeout(() => setToast(null), 1800); };
  const like = (id) => setPosts(p => p.map(x => x.id === id ? { ...x, liked: !x.liked, likes: x.likes + (x.liked ? -1 : 1) } : x));
  const publish = () => {
    if (!draft.trim()) return;
    setPosts(p => [{ id: Date.now(), who: 'MA', name: 'Marco', group: 'Turma 6ºB', time: 'agora', text: draft.trim(), likes: 0, liked: false, comments: 0 }, ...p]);
    setDraft(''); showToast('Publicado no mural! 🎉');
  };
  const toggleGroup = (name) => setGroups(g => g.map(x => x.name === name ? { ...x, joined: !x.joined, members: x.members + (x.joined ? -1 : 1) } : x));

  if (screen === 'login') {
    return (
      <div className="sz-login-bg">
        <div className="sz-login-card">
          <button onClick={() => nav('/')} className="sz-back-btn">← Voltar</button>
          <div className="sz-login-logo-wrap">
            <img src="/logo.png" alt="SchuleZap" className="sz-login-logo" />
          </div>
          <h1 className="sz-login-title"><span style={{ color: C.ink }}>Schule</span><span style={{ color: C.red }}>Zap</span></h1>
          <p className="sz-login-sub">Rede Social Escolar de Pomerode, SC</p>
          <p className="sz-login-subsub">Nossa Pequena Alemanha.</p>

          <div className="sz-login-form">
            <p className="sz-login-label">Código de convite da turma</p>
            <input
              value={code} onChange={e => { setCode(e.target.value); setCodeErr(false); }}
              placeholder="Ex.: 6B-2026"
              className={`sz-login-input ${codeErr ? 'sz-login-input--err' : ''}`}
            />
            {codeErr && <p className="sz-login-err">Digite o código de convite pra entrar.</p>}
            <button className="btn-primary sz-login-btn" onClick={() => code.trim() ? setScreen('app') : setCodeErr(true)}>
              Entrar
            </button>
            <button className="btn-gold sz-login-btn" style={{ marginTop: 10 }} onClick={() => setScreen('app')}>
              Entrar como Marco (demo) →
            </button>
          </div>
          <p className="sz-login-notice">🔒 Rede fechada · Só por convite · Feita pra Pomerode, SC</p>
          <p className="sz-login-credit">Criado por <strong>Thiago Tomelin</strong></p>
        </div>
      </div>
    );
  }

  return (
    <div className="sz-app-bg">
      <div className="sz-app-frame">
        {/* TOPBAR */}
        <div className="sz-topbar">
          <div className="sz-topbar-logo">
            <img src="/logo.png" alt="SchuleZap" className="sz-topbar-img" />
            <span className="sz-topbar-name"><span style={{ color: C.ink }}>Schule</span><span style={{ color: C.red }}>Zap</span></span>
          </div>
          <div className="sz-topbar-icons">
            <span style={{ position: 'relative' }}>🔔<span className="sz-notif-dot" /></span>
            <span>💬</span>
          </div>
        </div>

        {/* SCREEN */}
        <div className="sz-screen">
          {tab === 'feed'    && <Feed posts={posts} draft={draft} setDraft={setDraft} publish={publish} like={like} statusEmoji={statusEmoji} />}
          {tab === 'grupos'  && <Grupos groups={groups} toggle={toggleGroup} showToast={showToast} />}
          {tab === 'jogos'   && <Jogos showToast={showToast} />}
          {tab === 'perfil'  && <Perfil posts={posts} statusEmoji={statusEmoji} setStatusEmoji={setStatusEmoji} />}
        </div>

        {/* BOTTOM NAV */}
        <div className="sz-bottom-nav">
          {[['feed','🏠','Mural'],['grupos','👥','Grupos'],['jogos','🎮','Jogos'],['perfil','🙂','Perfil']].map(([id,ic,lb]) => (
            <button key={id} onClick={() => setTab(id)} className={`sz-nav-btn ${tab === id ? 'sz-nav-btn--active' : ''}`}>
              <span className="sz-nav-icon">{ic}</span>
              <span className="sz-nav-label">{lb}</span>
            </button>
          ))}
        </div>
      </div>

      {toast && <div className="sz-toast">{toast}</div>}
    </div>
  );
}

/* =================== FEED =================== */
function Feed({ posts, draft, setDraft, publish, like, statusEmoji }) {
  const stories = [['LU','Lucas','🎮'],['BE','Bel','⚽'],['TH','Théo','🚀'],['HE','Helena','🎨']];
  return (
    <div>
      <div className="sz-stories">
        <div className="sz-story-item sz-story-add">
          <div className="sz-story-ring sz-story-ring--dashed"><span style={{ fontSize: 22, color: C.goldDeep }}>＋</span></div>
          <span className="sz-story-name">Status</span>
        </div>
        {stories.map(([id,nm,em]) => (
          <div key={nm} className="sz-story-item">
            <div className="sz-story-ring"><Avatar id={id} size={44} emoji={em} /></div>
            <span className="sz-story-name">{nm}</span>
          </div>
        ))}
      </div>

      <div className="sz-composer">
        <Avatar id="MA" size={38} emoji={statusEmoji} />
        <div style={{ flex: 1 }}>
          <textarea value={draft} onChange={e => setDraft(e.target.value)} placeholder="No que você tá pensando, Marco?" rows={2} className="sz-composer-input" />
          <div className="sz-composer-actions">
            <div style={{ display: 'flex', gap: 10, fontSize: 20 }}><span>📷</span><span>😀</span><span>🎮</span></div>
            <button className="btn-primary sz-post-btn" onClick={publish}>Postar</button>
          </div>
        </div>
      </div>

      {posts.map(p => (
        <div key={p.id} className="sz-post">
          <div className="sz-post-header">
            <Avatar id={p.who} size={40} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 800, fontSize: 14, color: C.ink }}>{p.name}</span>
                {p.badge && <span className="sz-badge">{p.badge}</span>}
              </div>
              <span className="sz-post-meta">{p.group} · {p.time}</span>
            </div>
          </div>
          <p className="sz-post-text">{p.text}</p>
          {p.photo && <div className="sz-post-photo">🖼️</div>}
          <div className="sz-post-actions">
            <button onClick={() => like(p.id)} className={`sz-reaction-btn ${p.liked ? 'sz-reaction-btn--liked' : ''}`}>{p.liked ? '❤️' : '🤍'} {p.likes}</button>
            <button className="sz-reaction-btn">💬 {p.comments}</button>
            <button className="sz-reaction-btn">😄 reagir</button>
          </div>
        </div>
      ))}
      <div className="sz-feed-end">Você viu tudo por aqui 🎉</div>
    </div>
  );
}

/* =================== GRUPOS =================== */
function Grupos({ groups, toggle, showToast }) {
  return (
    <div className="sz-section-pad">
      <h2 className="sz-section-title">Grupos</h2>
      <p className="sz-section-sub">Cantinhos da turma — cada grupo tem seu próprio mural.</p>
      {groups.map(g => (
        <div key={g.name} className="sz-group-card">
          <div className="sz-group-icon" style={{ background: g.color }}>{g.emoji}</div>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontWeight: 800, fontSize: 15, color: C.ink }}>{g.name}</p>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: C.inkSoft }}>{g.members} colegas</p>
          </div>
          <button onClick={() => toggle(g.name)} className={g.joined ? 'btn-gold sz-group-btn' : 'btn-primary sz-group-btn'}>
            {g.joined ? 'Participando' : 'Entrar'}
          </button>
        </div>
      ))}
      <button className="btn-gold" style={{ width: '100%', marginTop: 4 }} onClick={() => showToast('Em breve! 🚧')}>＋ Criar grupo</button>
    </div>
  );
}

/* =================== JOGOS =================== */
function Jogos({ showToast }) {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  if (done) return (
    <div className="sz-section-pad" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 72, marginBottom: 8 }}>{score >= 3 ? '🏆' : '🎉'}</div>
      <h2 className="sz-section-title">{score} de {QUIZ.length} acertos!</h2>
      <p className="sz-section-sub">{score >= 3 ? 'Mandou muito bem, craque de Pomerode!' : 'Boa tentativa! Bora de novo?'}</p>
      <button className="btn-primary" style={{ marginTop: 16 }} onClick={() => { setI(0); setPicked(null); setScore(0); setDone(false); }}>Jogar de novo</button>
    </div>
  );

  const q = QUIZ[i];
  const next = () => {
    if (picked === null) return;
    if (picked === q.correct) setScore(s => s + 1);
    if (i + 1 >= QUIZ.length) setDone(true);
    else { setI(i + 1); setPicked(null); }
  };

  return (
    <div className="sz-section-pad">
      <h2 className="sz-section-title">Jogos e desafios</h2>
      <div className="sz-quiz-card">
        <div className="sz-quiz-header">
          <span style={{ fontWeight: 800, color: C.redDeep, fontSize: 13 }}>🧠 Quiz de Pomerode</span>
          <span className="sz-quiz-prog">{i + 1}/{QUIZ.length}</span>
        </div>
        <p className="sz-quiz-q">{q.q}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {q.a.map((opt, idx) => {
            const isPicked = picked === idx;
            const reveal = picked !== null;
            const correct = idx === q.correct;
            let cls = 'sz-quiz-opt';
            if (reveal && correct) cls += ' sz-quiz-opt--correct';
            else if (reveal && isPicked) cls += ' sz-quiz-opt--wrong';
            return (
              <button key={idx} onClick={() => picked === null && setPicked(idx)} className={cls}>
                {opt}
                {reveal && correct && <span>✅</span>}
                {reveal && isPicked && !correct && <span>❌</span>}
              </button>
            );
          })}
        </div>
        <button className={`btn-primary sz-quiz-next ${picked === null ? 'sz-quiz-next--disabled' : ''}`} onClick={next} disabled={picked === null}>
          {i + 1 >= QUIZ.length ? 'Ver resultado' : 'Próxima →'}
        </button>
      </div>

      <p className="sz-games-label">Mais pra brincar</p>
      {[['⚽','Adivinha o placar','Chute o resultado do jogo de sábado'],['🎨','Desenho do dia','Um tema novo todo dia pra desenhar'],['🔤','Palavra em alemão','Aprenda e desafie um amigo']].map(([em,t,d]) => (
        <div key={t} className="sz-game-item" onClick={() => showToast('Em breve! 🚧')}>
          <span style={{ fontSize: 26 }}>{em}</span>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontWeight: 800, fontSize: 14, color: C.ink }}>{t}</p>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: C.inkSoft }}>{d}</p>
          </div>
          <span style={{ color: C.goldDeep, fontWeight: 800 }}>→</span>
        </div>
      ))}
    </div>
  );
}

/* =================== PERFIL =================== */
function Perfil({ posts, statusEmoji, setStatusEmoji }) {
  const mine = posts.filter(p => p.who === 'MA');
  const totalLikes = mine.reduce((s, p) => s + p.likes, 0);
  const emojis = ['🎮','⚽','🚀','😎','🎨','🇩🇪','📚','😄'];
  const badges = [['🏅','Craque da semana'],['🎯','Acertou o quiz'],['🌟','Primeiro post'],['🤝','5 amigos']];

  return (
    <div>
      <div className="sz-profile-hero">
        <div className="sz-profile-avatar-wrap">
          <Avatar id="MA" size={86} emoji={statusEmoji} />
        </div>
        <h2 className="sz-profile-name">Marco 🎮</h2>
        <p className="sz-profile-school">Turma 6ºB · Escola Doutor Blumenau · Pomerode, SC</p>
        <p className="sz-profile-credit">Criado por <strong>Thiago Tomelin</strong></p>
      </div>

      <div className="sz-stats-row">
        {[[mine.length,'Posts'],[totalLikes,'Curtidas'],[12,'Amigos']].map(([n,l]) => (
          <div key={l} className="sz-stat-card">
            <div className="sz-stat-num">{n}</div>
            <div className="sz-stat-label">{l}</div>
          </div>
        ))}
      </div>

      <div className="sz-section-pad">
        <p className="sz-games-label">Status do dia</p>
        <div className="sz-emoji-grid">
          {emojis.map(e => (
            <button key={e} onClick={() => setStatusEmoji(e)} className={`sz-emoji-btn ${statusEmoji === e ? 'sz-emoji-btn--active' : ''}`}>{e}</button>
          ))}
        </div>

        <p className="sz-games-label" style={{ marginTop: 20 }}>Medalhas 🏆</p>
        <div className="sz-badges-grid">
          {badges.map(([em,t]) => (
            <div key={t} className="sz-badge-card">
              <span style={{ fontSize: 22 }}>{em}</span>
              <span style={{ fontWeight: 800, fontSize: 13, color: C.ink }}>{t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
