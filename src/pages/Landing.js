import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icons';
import { Avatar, Tile, Pill, Wordmark } from '../components/UI';
import './Landing.css';

const FEATURES = [
  { icon: 'grid',    tone: 'red',   title: 'Mural da turma',   desc: 'Posts, fotos, curtidas e comentários — só entre colegas da escola.' },
  { icon: 'users',   tone: 'gold',  title: 'Grupos',           desc: 'Um cantinho pra cada sala, time ou clube, cada um com seu mural.' },
  { icon: 'gamepad', tone: 'blue',  title: 'Desafios',         desc: 'Quiz, "adivinha o placar", palavra em alemão do dia e ranking semanal.' },
  { icon: 'trophy',  tone: 'gold',  title: 'Conquistas',       desc: 'Medalhas, sequência de dias e o título de craque da semana no perfil.' },
  { icon: 'lock',    tone: 'red',   title: 'Só por convite',   desc: 'Ninguém se cadastra sozinho. Cada aluno recebe um código único da escola.' },
  { icon: 'shield',  tone: 'blue',  title: 'Moderado',         desc: 'Um responsável acompanha tudo. Filtro de palavras e botão de denúncia.' },
];

const STEPS = [
  { icon: 'ticket', title: 'A escola libera o código', desc: 'Um convite único por aluno, gerado pelo responsável.' },
  { icon: 'user',   title: 'Cria o perfil',            desc: 'Apelido, cor e status. Nenhum dado pessoal fica exposto.' },
  { icon: 'rocket', title: 'Entra no mural',           desc: 'Posta, curte, joga e sobe no ranking com a turma.' },
];

const VOICES = [
  { initial: 'L', who: 'Lucas',    role: '6ºB',        text: 'É tipo o Instagram, só que só da nossa escola. Os desafios são a melhor parte.' },
  { initial: 'B', who: 'Bel',      role: '6ºA',        text: 'Já ganhei três figurinhas raras no adivinha o placar. Sou a craque da semana.' },
  { initial: 'A', who: 'Prof. Ana', role: 'Professora', text: 'Uma rede social fechada e moderada pros alunos. Era o que faltava.' },
];

export default function Landing() {
  const nav = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <div className="lp">
      <nav className={`lp-nav ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="lp-nav-inner">
          <a href="#top" className="lp-brand">
            <img src="/logo.png" alt="SchuleZap" className="lp-brand-img" />
            <Wordmark size={22} />
          </a>
          <div className="lp-nav-links">
            <a href="#funcionalidades">Funcionalidades</a>
            <a href="#como-funciona">Como funciona</a>
            <a href="#seguranca">Segurança</a>
          </div>
          <button className="btn btn-red btn-sm" onClick={() => nav('/app')}>Entrar <Icon name="arrowRight" size={16} /></button>
        </div>
      </nav>

      <header className="lp-hero fachwerk" id="top">
        <div className="lp-hero-inner">
          <div className="lp-hero-copy">
            <Pill icon="school" tone="ink">Escola Doutor Blumenau · Pomerode, SC</Pill>
            <h1 className="lp-h1">
              A rede da<br />sua turma.<br />
              <span className="lp-h1-red">Só da sua turma.</span>
            </h1>
            <p className="lp-lead">Mural, grupos, desafios e ranking. Fechado por convite, sem estranhos, com um responsável de olho.</p>
            <div className="lp-hero-actions">
              <button className="btn btn-red btn-lg" onClick={() => nav('/app')}><Icon name="ticket" size={20} /> Usar meu convite</button>
              <a href="#seguranca" className="btn btn-ghost btn-lg"><Icon name="shield" size={20} /> Sou responsável</a>
            </div>
            <div className="lp-proof">
              <div className="lp-proof-avatars">
                <Avatar initial="L" size={34} ring />
                <Avatar initial="B" size={34} ring />
                <Avatar initial="T" size={34} ring />
                <Avatar initial="H" size={34} ring />
              </div>
              <span><strong>120+ alunos</strong> já estão na turma</span>
            </div>
          </div>

          <div className="lp-hero-device">
            <PhonePreview />
          </div>
        </div>
      </header>

      <section className="lp-section" id="funcionalidades">
        <div className="lp-container">
          <div className="lp-section-head">
            <h2 className="lp-h2">Tudo que a turma precisa, num lugar só</h2>
            <p className="lp-sub">Sem anúncio, sem algoritmo, sem gente de fora.</p>
          </div>
          <div className="lp-grid-3">
            {FEATURES.map(f => (
              <article key={f.title} className="card lp-feature">
                <Tile icon={f.icon} tone={f.tone} size={48} radius={14} />
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-section lp-section--red" id="como-funciona">
        <div className="lp-container">
          <div className="lp-section-head">
            <h2 className="lp-h2" style={{ color: '#fff' }}>Entrar leva um minuto</h2>
            <p className="lp-sub" style={{ color: 'rgba(255,255,255,.75)' }}>Três passos e o aluno já está no mural.</p>
          </div>
          <div className="lp-grid-3">
            {STEPS.map((s, i) => (
              <div key={s.title} className="lp-step">
                <div className="lp-step-top">
                  <Tile icon={s.icon} tone="solidGold" size={48} radius={14} />
                  <span className="lp-step-n">{i + 1}</span>
                </div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <button className="btn btn-gold btn-lg" onClick={() => nav('/app')}>Usar meu convite <Icon name="arrowRight" size={20} /></button>
          </div>
        </div>
      </section>

      <section className="lp-section" id="seguranca">
        <div className="lp-container lp-safety">
          <div className="lp-safety-copy">
            <Pill icon="shield" tone="red">Pra pais e responsáveis</Pill>
            <h2 className="lp-h2">Feito pra ser seguro desde o primeiro dia</h2>
            <ul className="lp-checklist">
              {[
                'Ninguém se cadastra sozinho: só entra com código gerado pela escola',
                'Nada é público nem aparece no Google — tudo atrás de login',
                'Um responsável administra, vê tudo e pode remover qualquer conteúdo',
                'Sem mensagem pra fora do grupo fechado',
                'Filtro de palavras e botão de denúncia em cada post',
                'Coleta mínima de dados, alinhada à LGPD pra menores',
              ].map(t => (
                <li key={t}><span className="lp-check"><Icon name="check" size={14} stroke={3} /></span>{t}</li>
              ))}
            </ul>
          </div>
          <div className="lp-safety-card card">
            <div className="lp-safety-card-top">
              <Tile icon="shield" tone="ink" size={44} />
              <div>
                <p className="lp-safety-card-title">Painel do responsável</p>
                <p className="lp-safety-card-sub">Visão de tudo que acontece</p>
              </div>
            </div>
            {[['Convites gerados', '24'], ['Posts esta semana', '86'], ['Denúncias abertas', '0']].map(([k, v]) => (
              <div key={k} className="lp-safety-row"><span>{k}</span><strong>{v}</strong></div>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-section lp-section--paper">
        <div className="lp-container">
          <div className="lp-section-head">
            <h2 className="lp-h2">A turma aprovou</h2>
          </div>
          <div className="lp-grid-3">
            {VOICES.map(v => (
              <blockquote key={v.who} className="card lp-voice">
                <p>"{v.text}"</p>
                <footer>
                  <Avatar initial={v.initial} size={40} />
                  <div><strong>{v.who}</strong><span>{v.role}</span></div>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-cta fachwerk">
        <div className="lp-container lp-cta-inner">
          <img src="/logo.png" alt="SchuleZap" className="lp-cta-logo" />
          <div>
            <h2 className="lp-h2">Pronto pra entrar?</h2>
            <p className="lp-sub">Peça seu código de convite pra escola e entre no mural da sua turma.</p>
            <button className="btn btn-red btn-lg" onClick={() => nav('/app')}><Icon name="ticket" size={20} /> Usar meu convite</button>
          </div>
        </div>
      </section>

      <footer className="lp-footer">
        <div className="lp-container lp-footer-inner">
          <div className="lp-brand">
            <img src="/logo.png" alt="SchuleZap" className="lp-brand-img" />
            <Wordmark size={20} light />
          </div>
          <p>Rede Social Escolar de Pomerode, SC — Nossa Pequena Alemanha.</p>
          <p className="lp-footer-credit">Criado por <strong>Thiago Tomelin</strong> · 2026</p>
        </div>
      </footer>
    </div>
  );
}

function PhonePreview() {
  return (
    <div className="ph">
      <div className="ph-screen">
        <div className="ph-top">
          <Wordmark size={15} />
          <div className="ph-top-icons"><Icon name="bell" size={16} /><Icon name="chat" size={16} /></div>
        </div>
        <div className="ph-stories">
          <div className="ph-story"><div className="ph-story-add"><Icon name="plus" size={16} /></div><span>Você</span></div>
          {[['L', 'Lucas'], ['B', 'Bel'], ['T', 'Théo'], ['H', 'Helena']].map(([i, n]) => (
            <div key={n} className="ph-story"><Avatar initial={i} size={36} ring /><span>{n}</span></div>
          ))}
        </div>
        <div className="ph-post">
          <div className="ph-post-head">
            <Avatar initial="B" size={30} />
            <div><strong>Bel <span className="ph-tag"><Icon name="medal" size={10} stroke={2.5} /> craque</span></strong><span>Grupo do Futebol · 20 min</span></div>
          </div>
          <p>Quem acertar o placar do jogo de sábado leva a figurinha rara. Comenta aí.</p>
          <div className="ph-actions">
            <Pill icon="heart" tone="red" size="sm" active>12</Pill>
            <Pill icon="comment" size="sm">7</Pill>
            <Pill icon="send" size="sm" />
          </div>
        </div>
        <div className="ph-post">
          <div className="ph-post-head">
            <Avatar initial="L" size={30} />
            <div><strong>Lucas</strong><span>Turma 6ºB · 5 min</span></div>
          </div>
          <p>Servidor novo no ar. Quem tá dentro hoje?</p>
          <div className="ph-photo"><Icon name="photo" size={22} /></div>
          <div className="ph-actions">
            <Pill icon="heart" size="sm">8</Pill>
            <Pill icon="comment" size="sm">3</Pill>
          </div>
        </div>
        <div className="ph-nav">
          <span className="is-active"><Icon name="home" size={18} />Mural</span>
          <span><Icon name="users" size={18} />Grupos</span>
          <span><Icon name="gamepad" size={18} />Desafios</span>
          <span><Icon name="user" size={18} />Perfil</span>
        </div>
      </div>
    </div>
  );
}
