import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

const FEATURES = [
  { emoji: '🏠', title: 'Mural da turma', desc: 'Poste, curta e comente só com os colegas da escola. Sem estranhos, sem perigo.' },
  { emoji: '👥', title: 'Grupos', desc: 'Cantinhos separados pra cada turma, time ou clube — cada grupo tem seu próprio mural.' },
  { emoji: '🎮', title: 'Jogos e desafios', desc: 'Quiz, "adivinha o placar", palavra em alemão do dia e muito mais pra brincar junto.' },
  { emoji: '🏅', title: 'Medalhas e conquistas', desc: 'Ganhe figurinhas raras, seja o "craque da semana" e colecione medalhas no seu perfil.' },
  { emoji: '🔒', title: 'Só entra por convite', desc: 'Nenhum desconhecido acessa. Cada aluno recebe um código gerado pela escola.' },
  { emoji: '🇩🇪', title: 'Orgulho de Pomerode', desc: 'Nossa Pequena Alemanha tem a sua rede social. Feita aqui, pra quem é daqui.' },
];

const TESTIMONIALS = [
  { who: 'Lucas', id: 'LU', role: 'Aluno do 6ºB', text: 'É igual ao Instagram mas só a galera da escola. A parte de jogos é demais!', emoji: '🎮' },
  { who: 'Bel', id: 'BE', role: 'Aluna do 6ºA', text: 'Adoro o "adivinha o placar". Já ganhei três figurinhas raras essa semana!', emoji: '⚽' },
  { who: 'Prof. Ana', id: 'PA', role: 'Professora', text: 'Finalmente uma rede social segura e moderada para os alunos usarem. Excelente iniciativa.', emoji: '📚' },
];

const STEPS = [
  { n: '01', title: 'A escola libera o código', desc: 'O responsável gera um código de convite único pra cada aluno.' },
  { n: '02', title: 'Aluno cria o perfil', desc: 'Escolhe apelido, emoji de status e foto — nada de dado pessoal exposto.' },
  { n: '03', title: 'Entra no mural da turma', desc: 'Já pode postar, curtir, jogar e ganhar medalhas com os colegas.' },
];

const AVATARS = {
  LU: { bg: '#2E86C1', fg: '#fff' },
  BE: { bg: '#E89B00', fg: '#3A2A0C' },
  PA: { bg: '#5B8C2A', fg: '#fff' },
};

function Avatar({ id, size = 48 }) {
  const a = AVATARS[id] || { bg: '#C62828', fg: '#fff' };
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: a.bg, color: a.fg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: size * 0.36, flexShrink: 0, boxShadow: 'inset 0 2px 4px rgba(255,255,255,.3)' }}>{id}</div>
  );
}

export default function Landing() {
  const nav = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <div className="lp-root">
      {/* ===== NAV ===== */}
      <nav className={`lp-nav ${scrolled ? 'lp-nav--scrolled' : ''}`}>
        <div className="lp-nav-inner">
          <div className="lp-logo">
            <img src="/logo.png" alt="SchuleZap" className="lp-logo-img" />
            <span className="lp-logo-text"><span className="lp-logo-schule">Schule</span><span className="lp-logo-zap">Zap</span></span>
          </div>
          <div className="lp-nav-links">
            <a href="#funcionalidades">Funcionalidades</a>
            <a href="#como-funciona">Como funciona</a>
            <a href="#depoimentos">Depoimentos</a>
          </div>
          <button className="btn-primary lp-nav-cta" onClick={() => nav('/app')}>Entrar no app →</button>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section className="lp-hero">
        <div className="lp-hero-bg-stripes" aria-hidden="true" />
        <div className="lp-hero-inner">
          <div className="lp-hero-text">
            <div className="lp-hero-badge">🏫 Escola Doutor Blumenau · Pomerode, SC</div>
            <h1 className="lp-hero-h1">
              A rede social<br />
              <span className="lp-hero-highlight">da sua escola.</span>
            </h1>
            <p className="lp-hero-sub">
              Mural da turma, grupos, jogos, medalhas e muito mais — num ambiente fechado, seguro e feito pra molecada de Pomerode se divertir junto.
            </p>
            <div className="lp-hero-actions">
              <button className="btn-primary" onClick={() => nav('/app')}>Entrar com código de convite</button>
              <a href="#como-funciona" className="lp-hero-link">Como funciona? ↓</a>
            </div>
            <div className="lp-hero-proof">
              <div className="lp-hero-avatars">
                {['LU','BE','PA'].map(id => <Avatar key={id} id={id} size={32} />)}
              </div>
              <span>Mais de <strong>120 alunos</strong> já na plataforma</span>
            </div>
          </div>
          <div className="lp-hero-phone">
            <div className="lp-phone-frame">
              <div className="lp-phone-notch" />
              <div className="lp-phone-screen">
                <div className="lp-phone-topbar">
                  <img src="/logo.png" alt="logo" style={{ width: 26, height: 26, borderRadius: 6, objectFit: 'cover' }} />
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16 }}><span style={{ color: '#3A2A0C' }}>Schule</span><span style={{ color: '#C62828' }}>Zap</span></span>
                  <span style={{ fontSize: 18 }}>🔔</span>
                </div>
                <div className="lp-phone-stories">
                  {[['LU','🎮'],['BE','⚽'],['TH','🚀'],['HE','🎨']].map(([id,em])=>(
                    <div key={id} className="lp-story">
                      <div className="lp-story-ring"><Avatar id={id} size={40} /></div>
                      <span style={{fontSize:10,fontWeight:700,color:'#8A7A55'}}>{id}</span>
                    </div>
                  ))}
                </div>
                <div className="lp-phone-post">
                  <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
                    <Avatar id="BE" size={34} />
                    <div><p style={{margin:0,fontWeight:800,fontSize:13,color:'#3A2A0C'}}>Bel <span style={{fontSize:10,background:'#F8D7D3',color:'#C62828',padding:'1px 7px',borderRadius:999,marginLeft:4}}>🏅 craque</span></p><p style={{margin:0,fontSize:11,color:'#8A7A55'}}>há 20 min</p></div>
                  </div>
                  <p style={{margin:'0 0 8px',fontSize:13,fontWeight:600,color:'#3A2A0C',lineHeight:1.4}}>Quem acertar o placar ganha figurinha rara 🏆 comenta aí!</p>
                  <div style={{display:'flex',gap:8,fontSize:12}}>
                    <span style={{background:'#F8D7D3',color:'#C62828',padding:'4px 10px',borderRadius:999,fontWeight:800}}>❤️ 12</span>
                    <span style={{background:'#F7F1E0',color:'#8A7A55',padding:'4px 10px',borderRadius:999,fontWeight:700}}>💬 7</span>
                  </div>
                </div>
                <div className="lp-phone-post" style={{marginTop:10}}>
                  <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
                    <Avatar id="LU" size={34} />
                    <div><p style={{margin:0,fontWeight:800,fontSize:13,color:'#3A2A0C'}}>Lucas</p><p style={{margin:0,fontSize:11,color:'#8A7A55'}}>há 5 min</p></div>
                  </div>
                  <p style={{margin:'0 0 8px',fontSize:13,fontWeight:600,color:'#3A2A0C',lineHeight:1.4}}>Alguém pra jogar depois da aula hoje? 👾</p>
                  <div style={{height:60,borderRadius:10,background:'linear-gradient(135deg,#FCD34D,#E89B00)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:28}}>🖼️</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="lp-features" id="funcionalidades">
        <div className="lp-section-inner">
          <div className="lp-section-label">O que tem no SchuleZap</div>
          <h2 className="lp-section-h2">Tudo que a turma precisa,<br />num lugar só.</h2>
          <div className="lp-features-grid">
            {FEATURES.map(f => (
              <div key={f.title} className="lp-feature-card">
                <div className="lp-feature-emoji">{f.emoji}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== COMO FUNCIONA ===== */}
      <section className="lp-steps" id="como-funciona">
        <div className="lp-section-inner">
          <div className="lp-section-label" style={{ color: '#FCD34D' }}>Simples assim</div>
          <h2 className="lp-section-h2" style={{ color: '#fff' }}>Como entrar na turma</h2>
          <div className="lp-steps-grid">
            {STEPS.map(s => (
              <div key={s.n} className="lp-step-card">
                <div className="lp-step-num">{s.n}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <button className="btn-gold" onClick={() => nav('/app')}>Entrar agora →</button>
          </div>
        </div>
      </section>

      {/* ===== DEPOIMENTOS ===== */}
      <section className="lp-testimonials" id="depoimentos">
        <div className="lp-section-inner">
          <div className="lp-section-label">Quem já usa</div>
          <h2 className="lp-section-h2">A turma aprovou</h2>
          <div className="lp-testimonials-grid">
            {TESTIMONIALS.map(t => (
              <div key={t.who} className="lp-testimonial-card">
                <div className="lp-testimonial-emoji">{t.emoji}</div>
                <p className="lp-testimonial-text">"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 16 }}>
                  <Avatar id={t.id} size={40} />
                  <div>
                    <p style={{ margin: 0, fontWeight: 800, fontSize: 14 }}>{t.who}</p>
                    <p style={{ margin: 0, fontSize: 12, color: 'var(--ink-soft)' }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA FINAL ===== */}
      <section className="lp-cta">
        <div className="lp-section-inner" style={{ textAlign: 'center' }}>
          <img src="/logo.png" alt="SchuleZap" className="lp-cta-logo" />
          <h2 className="lp-cta-h2">Pronto pra entrar no SchuleZap?</h2>
          <p className="lp-cta-sub">Peça seu código de convite pra escola e entre no mural da sua turma hoje mesmo.</p>
          <button className="btn-primary" style={{ fontSize: 17, padding: '16px 36px' }} onClick={() => nav('/app')}>Entrar com código de convite</button>
          <p style={{ marginTop: 14, fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,.7)' }}>🔒 Rede fechada · Só por convite · Feita pra Pomerode, SC</p>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div className="lp-logo" style={{ marginBottom: 8 }}>
            <img src="/logo.png" alt="SchuleZap" style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover' }} />
            <span className="lp-logo-text"><span className="lp-logo-schule">Schule</span><span className="lp-logo-zap">Zap</span></span>
          </div>
          <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-soft)', marginBottom: 4 }}>Rede Social Escolar de Pomerode, SC — Nossa Pequena Alemanha.</p>
          <p style={{ fontSize: 12, color: 'var(--ink-soft)' }}>Criado por <strong>Thiago Tomelin</strong> · 2026 · Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
