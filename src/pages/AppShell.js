import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icons';
import { Avatar, Tile, Pill, Wordmark } from '../components/UI';
import { api, setToken, clearToken, getToken } from '../api';
import { FOTOS } from '../demoFotos';
import { CATEGORIAS, CARTOES, falar } from '../falacomigo';
import './AppShell.css';

const API_ATIVA = Boolean(process.env.REACT_APP_API_URL);

/* ===================== dados demo (sem backend) ===================== */
const DEMO_POSTS = [
  { id: 1, autor: { id: 12, avatar_inicial: 'B', apelido: 'Bel' }, grupo: { nome: 'Grupo do Futebol' }, tempo: '2 h', texto: 'Quem acertar o placar do jogo de sábado leva a figurinha rara! 🏆 Comenta aí o palpite #futebol #turma8a', imagens: [FOTOS.futebol], reacoes: 8, por_tipo: { amei: 3, curtida: 4, uau: 1 }, minha_reacao: null, comentarios: 4, salvo: false, badge: 'craque' },
  { id: 2, autor: { id: 13, avatar_inicial: 'L', apelido: 'Lucas' }, grupo: { nome: 'Cantinho dos Games' }, tempo: '5 h', texto: 'Servidor novo no ar! Quem tá dentro hoje depois da aula? #games', imagens: [FOTOS.games], reacoes: 4, por_tipo: { amei: 2, curtida: 2 }, minha_reacao: null, comentarios: 2, salvo: false },
  { id: 3, autor: { id: 16, avatar_inicial: 'H', apelido: 'Helena' }, grupo: { nome: 'Desenho e Arte' }, tempo: '12 h', texto: 'Terminei o desenho da casa enxaimel pro trabalho de artes. O que acharam? 🎨 #enxaimel #arte', imagens: [FOTOS.enxaimel], reacoes: 6, por_tipo: { amei: 3, uau: 2, curtida: 1 }, minha_reacao: null, comentarios: 3, salvo: true },
  { id: 4, autor: { id: 14, avatar_inicial: 'T', apelido: 'Théo' }, grupo: { nome: 'Clube de Alemão' }, tempo: '8 h', texto: 'Descobri que "Freunde" significa amigos em alemão. Combina com a gente! 🇩🇪 #alemao', reacoes: 4, por_tipo: { amei: 1, curtida: 2, risada: 1 }, minha_reacao: null, comentarios: 1, salvo: false },
  { id: 5, autor: { id: 18, avatar_inicial: 'L', apelido: 'Larissa' }, grupo: { nome: 'Turma 8º Ano A' }, tempo: '20 h', texto: 'Gente, a prova de matemática caiu tudo que a prof passou na revisão. Vale revisar o caderno! #prova', reacoes: 4, por_tipo: { uau: 1, curtida: 2, amei: 1 }, minha_reacao: null, comentarios: 2, salvo: false },
  { id: 6, autor: { id: 11, avatar_inicial: 'M', apelido: 'Marco' }, grupo: { nome: 'Turma 8º Ano A' }, tempo: '1 d', texto: 'Foto da nossa turma no passeio de ontem! Foi muito bom 😄 #turma8a', imagens: [FOTOS.turma], reacoes: 6, por_tipo: { amei: 3, curtida: 2, uau: 1 }, minha_reacao: null, comentarios: 2, salvo: false },
  { id: 7, autor: { id: 12, avatar_inicial: 'B', apelido: 'Bel' }, grupo: { nome: 'Turma 8º Ano A' }, tempo: '1 d', texto: 'As inscrições da Osterfest abriram! Quem vai fazer a oficina de pintar Ostereier? 🥚 #osterfest', imagens: [FOTOS.ovos], reacoes: 4, por_tipo: { amei: 1, uau: 1, curtida: 2 }, minha_reacao: null, comentarios: 1, salvo: false },
  { id: 8, autor: { id: 17, avatar_inicial: 'J', apelido: 'Julia' }, grupo: { nome: 'Clube de Alemão' }, tempo: '1 d', texto: 'Guten Morgen! Hoje a aula foi sobre as casas enxaimel de Pomerode. Aprendi um monte 🇩🇪', imagens: [FOTOS.sala], reacoes: 3, por_tipo: { amei: 2, curtida: 1 }, minha_reacao: null, comentarios: 0, salvo: false },
  { id: 9, autor: { id: 15, avatar_inicial: 'P', apelido: 'Pedro' }, grupo: { nome: 'Turma 8º Ano B' }, tempo: '2 d', texto: 'O lanche novo da cantina tá muito bom, recomendo! 🥪 #cantina', imagens: [FOTOS.lanche], reacoes: 3, por_tipo: { risada: 1, amei: 1, curtida: 1 }, minha_reacao: null, comentarios: 1, salvo: false },
  { id: 10, autor: { id: 16, avatar_inicial: 'H', apelido: 'Helena' }, grupo: { nome: 'Desenho e Arte' }, tempo: '2 d', texto: 'Desenho do dia: tema de hoje era "a rua da sua casa". Ficou assim 🎨 #desenhododia', imagens: [FOTOS.arte], reacoes: 3, por_tipo: { amei: 2, uau: 1 }, minha_reacao: null, comentarios: 1, salvo: false },
];

const DEMO_COMENTARIOS = {
  1: [
    { id: 1, autor: { id: 11, avatar_inicial: 'M', apelido: 'Marco' }, texto: '2 a 1 pro nosso time! 🔥' },
    { id: 2, autor: { id: 13, avatar_inicial: 'L', apelido: 'Lucas' }, texto: 'Vou de 3 a 0, esse ano a gente ganha' },
    { id: 3, autor: { id: 15, avatar_inicial: 'P', apelido: 'Pedro' }, texto: 'Concordo com o @Marco, 2 a 1' },
    { id: 4, autor: { id: 12, avatar_inicial: 'B', apelido: 'Bel' }, texto: 'Anotado! Sábado a gente vê quem acertou 😄', respondendo_id: 1 },
  ],
  2: [
    { id: 5, autor: { id: 11, avatar_inicial: 'M', apelido: 'Marco' }, texto: 'Tô dentro! Que horas?' },
    { id: 6, autor: { id: 19, avatar_inicial: 'G', apelido: 'Gustavo' }, texto: 'Bora! Entro depois das 18h' },
  ],
  3: [
    { id: 7, autor: { id: 17, avatar_inicial: 'J', apelido: 'Julia' }, texto: 'Ficou lindo Helena! Parece de verdade 😍' },
    { id: 8, autor: { id: 18, avatar_inicial: 'L', apelido: 'Larissa' }, texto: 'Caprichou demais nos detalhes da madeira' },
    { id: 9, autor: { id: 16, avatar_inicial: 'H', apelido: 'Helena' }, texto: 'Obrigada gente! Demorei uns 3 dias 🎨', respondendo_id: 7 },
  ],
  4: [{ id: 10, autor: { id: 17, avatar_inicial: 'J', apelido: 'Julia' }, texto: 'Que legal! Minha palavra favorita é Schmetterling (borboleta)' }],
  5: [
    { id: 11, autor: { id: 11, avatar_inicial: 'M', apelido: 'Marco' }, texto: 'Valeu pelo aviso, vou revisar hoje' },
    { id: 12, autor: { id: 14, avatar_inicial: 'T', apelido: 'Théo' }, texto: 'A questão 7 caiu igualzinha na revisão' },
  ],
  6: [
    { id: 13, autor: { id: 12, avatar_inicial: 'B', apelido: 'Bel' }, texto: 'Que dia bom foi esse! 😄' },
    { id: 14, autor: { id: 16, avatar_inicial: 'H', apelido: 'Helena' }, texto: 'Melhor passeio do ano' },
  ],
  7: [{ id: 15, autor: { id: 16, avatar_inicial: 'H', apelido: 'Helena' }, texto: 'Eu vou! Já me inscrevi na oficina' }],
  9: [{ id: 16, autor: { id: 13, avatar_inicial: 'L', apelido: 'Lucas' }, texto: 'O da terça é o melhor' }],
  10: [{ id: 17, autor: { id: 17, avatar_inicial: 'J', apelido: 'Julia' }, texto: 'Cada dia você desenha melhor' }],
};

const DEMO_GROUPS = [
  { id: 1, nome: 'Turma 8º Ano A', icone: 'school', membros: 24, participando: true },
  { id: 2, nome: 'Grupo do Futebol', icone: 'ball', membros: 18, participando: true },
  { id: 3, nome: 'Cantinho dos Games', icone: 'gamepad', membros: 31, participando: true },
  { id: 4, nome: 'Clube de Alemão', icone: 'language', membros: 12, participando: false },
  { id: 5, nome: 'Desenho e Arte', icone: 'palette', membros: 15, participando: false },
  { id: 6, nome: 'Clube do Livro', icone: 'book', membros: 9, participando: false },
  { id: 7, nome: 'Turma 8º Ano B', icone: 'school', membros: 22, participando: false },
];

const DEMO_RANKING = { minha_posicao: 5, meus_pontos: 180, top: [
  { posicao: 1, usuario: { id: 12, avatar_inicial: 'B', apelido: 'Bel' }, pontos: 240 },
  { posicao: 2, usuario: { id: 18, avatar_inicial: 'L', apelido: 'Larissa' }, pontos: 225 },
  { posicao: 3, usuario: { id: 13, avatar_inicial: 'L', apelido: 'Lucas' }, pontos: 210 },
  { posicao: 4, usuario: { id: 16, avatar_inicial: 'H', apelido: 'Helena' }, pontos: 195 },
  { posicao: 5, usuario: { id: 11, avatar_inicial: 'M', apelido: 'Marco' }, pontos: 180, eu: true },
  { posicao: 6, usuario: { id: 17, avatar_inicial: 'J', apelido: 'Julia' }, pontos: 165 },
  { posicao: 7, usuario: { id: 14, avatar_inicial: 'T', apelido: 'Théo' }, pontos: 150 },
  { posicao: 8, usuario: { id: 15, avatar_inicial: 'P', apelido: 'Pedro' }, pontos: 120 },
  { posicao: 9, usuario: { id: 19, avatar_inicial: 'G', apelido: 'Gustavo' }, pontos: 90 },
  { posicao: 10, usuario: { id: 20, avatar_inicial: 'R', apelido: 'Rafa' }, pontos: 75 },
] };

const DEMO_NOTIFS = [
  { tipo: 'curtida', quem: { avatar_inicial: 'B', apelido: 'Bel' }, texto: 'Foto da nossa turma no passeio de ontem!', tempo: '5 min' },
  { tipo: 'comentario', quem: { avatar_inicial: 'H', apelido: 'Helena' }, texto: 'Melhor passeio do ano', tempo: '18 min' },
  { tipo: 'medalha', titulo: 'Primeiro post', icone: 'star', tempo: '1 h' },
  { tipo: 'curtida', quem: { avatar_inicial: 'L', apelido: 'Larissa' }, texto: 'Foto da nossa turma no passeio de ontem!', tempo: '2 h' },
  { tipo: 'comentario', quem: { avatar_inicial: 'T', apelido: 'Théo' }, texto: 'A questão 7 caiu igualzinha na revisão', tempo: '4 h' },
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
/* Redimensiona/comprime a foto no navegador antes de enviar.
   Fotos de celular tem 3-8MB; assim chegam leves no servidor. */
function comprimirImagem(file, onOk, onErro, maxLado = 1280, qualidade = 0.8) {
  const reader = new FileReader();
  reader.onerror = onErro;
  reader.onload = () => {
    const img = new Image();
    img.onerror = onErro;
    img.onload = () => {
      let { width: w, height: h } = img;
      if (w > maxLado || h > maxLado) {
        if (w >= h) { h = Math.round((h * maxLado) / w); w = maxLado; }
        else { w = Math.round((w * maxLado) / h); h = maxLado; }
      }
      const c = document.createElement('canvas');
      c.width = w; c.height = h;
      c.getContext('2d').drawImage(img, 0, 0, w, h);
      onOk(c.toDataURL('image/jpeg', qualidade));
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
}

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
  const [conversaId, setConversaId] = useState(null); // chat aberto
  const [menuMais, setMenuMais] = useState(false);

  const showToast = useCallback((t) => { setToast(t); setTimeout(() => setToast(null), 2000); }, []);
  const abrirPerfil = useCallback((id) => { setPerfilId(id); setTab('perfil-outro'); setPainel(null); }, []);
  const abrirChat = useCallback(async (usuarioId) => {
    setPainel(null);
    if (!API_ATIVA) { setConversaId(usuarioId || 1); setTab('chat'); return; }
    try { const c = await api.abrirConversa(usuarioId); setConversaId(c.id); setTab('chat'); }
    catch (e) { setToast(e.message); setTimeout(() => setToast(null), 2000); }
  }, []);

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
          <CartaoAluno usuario={usuario} aoTocar={() => { setTab('perfil'); setPainel(null); }} />
          <div className="app-top-icons">
            <button className={`app-icon-btn ${painel === 'busca' ? 'is-on' : ''}`} aria-label="Buscar" onClick={() => setPainel(painel === 'busca' ? null : 'busca')}>
              <Icon name="search" size={22} />
            </button>
            <button className={`app-icon-btn ${painel === 'notif' ? 'is-on' : ''}`} aria-label="Notificações" onClick={() => setPainel(painel === 'notif' ? null : 'notif')}>
              <Icon name="bell" size={22} /><span className="app-dot" />
            </button>
            <button className={`app-icon-btn ${tab === 'conversas' ? 'is-on' : ''}`} aria-label="Mensagens" onClick={() => { setTab('conversas'); setPainel(null); }}><Icon name="chat" size={22} /></button>
            <button className="app-icon-btn" aria-label="Ranking" onClick={() => setTab('ranking')}><Icon name="trophy" size={22} /></button>
          </div>
        </header>

        <div className="app-body">
          {/* menu completo — desktop */}
          <nav className="app-nav app-nav--desktop">
            {[
              ['feed', 'home', 'Mural'],
              ['grupos', 'users', 'Grupos'],
              ['jogos', 'gamepad', 'Desafios'],
              ['avisos', 'bell', 'Avisos'],
              ['boletim', 'book', 'Boletim'],
              ['descobrir', 'search', 'Descobrir'],
              ['conversas', 'chat', 'Mensagens'],
              ['ranking', 'trophy', 'Ranking'],
              ...(ehModerador ? [['central', 'grid', 'Central da escola'], ['fila-fala', 'chat', 'Pedidos de ajuda'], ['moderar', 'shield', 'Moderar']] : []),
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
            {tab === 'fala' && <FalaComigo usuario={usuario} showToast={showToast} voltar={() => setTab('feed')} />}
            {tab === 'fila-fala' && ehModerador && <FilaFala showToast={showToast} />}
            {tab === 'central' && ehModerador && <CentralEscola usuario={usuario} showToast={showToast} />}
            {tab === 'avisos' && <Avisos usuario={usuario} showToast={showToast} />}
            {tab === 'boletim' && <Boletim showToast={showToast} />}
            {tab === 'descobrir' && <Descobrir abrirPerfil={abrirPerfil} showToast={showToast} verHashtag={(t) => { setTab('feed'); showToast(`Mostrando #${t}`); }} />}
            {tab === 'ranking' && <Ranking usuario={usuario} abrirPerfil={abrirPerfil} />}
            {tab === 'perfil' && <Perfil usuario={usuario} setUsuario={setUsuario} onLogout={sair} showToast={showToast} />}
            {tab === 'perfil-outro' && <PerfilOutro id={perfilId} usuario={usuario} showToast={showToast} voltar={() => setTab('feed')} abrirChat={abrirChat} abrirPerfil={abrirPerfil} />}
            {tab === 'conversas' && <Conversas abrirChat={(id) => { setConversaId(id); setTab('chat'); }} abrirBusca={() => setPainel('busca')} showToast={showToast} />}
            {tab === 'chat' && <Chat conversaId={conversaId} usuario={usuario} showToast={showToast} voltar={() => setTab('conversas')} />}
            {tab === 'moderar' && ehModerador && <Moderar showToast={showToast} />}
          </main>

          <aside className="app-widgets">
            <WidgetEscola usuario={usuario} />
            <WidgetAvisos irParaAvisos={() => { setTab('avisos'); setPainel(null); }} />
            <WidgetAgenda />
          </aside>
        </div>

        {/* barra estilo Instagram — celular */}
        <nav className="tabbar">
          <button className={`tabbar-btn ${tab === 'feed' ? 'is-active' : ''}`} onClick={() => { setTab('feed'); setPainel(null); }} aria-label="Mural">
            <Icon name="home" size={25} stroke={tab === 'feed' ? 2.6 : 2} />
          </button>
          <button className={`tabbar-btn ${tab === 'descobrir' ? 'is-active' : ''}`} onClick={() => { setTab('descobrir'); setPainel(null); }} aria-label="Descobrir">
            <Icon name="search" size={25} stroke={tab === 'descobrir' ? 2.6 : 2} />
          </button>
          <button className="tabbar-postar" onClick={() => { setTab('feed'); setPainel(null); setTimeout(() => document.querySelector('.composer-input')?.focus(), 120); }} aria-label="Publicar">
            <Icon name="plus" size={26} stroke={3} />
          </button>
          <button className={`tabbar-btn ${tab === 'conversas' || tab === 'chat' ? 'is-active' : ''}`} onClick={() => { setTab('conversas'); setPainel(null); }} aria-label="Mensagens">
            <Icon name="chat" size={25} stroke={tab === 'conversas' ? 2.6 : 2} />
          </button>
          <button className={`tabbar-btn ${['perfil', 'avisos', 'boletim', 'grupos', 'jogos', 'ranking', 'moderar'].includes(tab) ? 'is-active' : ''}`} onClick={() => setMenuMais(true)} aria-label="Mais">
            <Avatar initial={usuario.avatar_inicial} foto={usuario.foto_url} size={26} />
          </button>
        </nav>

        {menuMais && (
          <div className="mais-fundo" onClick={() => setMenuMais(false)}>
            <div className="mais-folha" onClick={(e) => e.stopPropagation()}>
              <div className="mais-alca" />
              <button className="mais-perfil" onClick={() => { setTab('perfil'); setMenuMais(false); }}>
                <Avatar initial={usuario.avatar_inicial} foto={usuario.foto_url} size={48} badgeIcon={usuario.status_icone} />
                <div><strong>{usuario.apelido}</strong><span>{usuario.turma ? `${usuario.turma} · ` : ''}Ver meu perfil</span></div>
                <Icon name="chevronRight" size={20} style={{ color: 'var(--ink-3)' }} />
              </button>
              <div className="mais-grade">
                {[
                  ['avisos', 'bell', 'Avisos'],
                  ['boletim', 'book', 'Boletim'],
                  ['grupos', 'users', 'Grupos'],
                  ['jogos', 'gamepad', 'Desafios'],
                  ['ranking', 'trophy', 'Ranking'],
                  ...(usuario.comunicacao_assistiva ? [['fala', 'chat', 'Fala Comigo']] : []),
                  ...(ehModerador ? [['central', 'grid', 'Central'], ['fila-fala', 'chat', 'Pedidos'], ['moderar', 'shield', 'Moderar']] : []),
                ].map(([id, ic, lb]) => (
                  <button key={id} className={`mais-item ${tab === id ? 'is-on' : ''}`} onClick={() => { setTab(id); setMenuMais(false); setPainel(null); }}>
                    <Tile icon={ic} tone={tab === id ? 'solidRed' : 'gold'} size={44} radius={14} />
                    <span>{lb}</span>
                  </button>
                ))}
              </div>
              <button className="btn btn-ghost btn-block" onClick={() => { setMenuMais(false); sair(); }}><Icon name="logout" size={18} /> Sair</button>
            </div>
          </div>
        )}

        {usuario.comunicacao_assistiva && tab !== 'fala' && (
          <button className="fala-fab" onClick={() => { setTab('fala'); setPainel(null); }} aria-label="Fala Comigo">
            <span>💬</span>
            <em>Fala Comigo</em>
          </button>
        )}

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
          {!API_ATIVA && <button type="button" className="btn btn-ghost btn-block" style={{ marginTop: 10 }} onClick={() => onEntrar({ id: 1, apelido: 'Marco', avatar_inicial: 'M', status_icone: 'gamepad', papel: 'aluno', pontos: 180, turma: '8º Ano A', comunicacao_assistiva: true })}>Ver a demo</button>}
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
  const [modo, setModo] = useState('turma');
  const [foto, setFoto] = useState(null);
  const [posts, setPosts] = useState(API_ATIVA ? [] : DEMO_POSTS);
  const [draft, setDraft] = useState('');
  const [imagens, setImagens] = useState([]);
  const [enquete, setEnquete] = useState(null);
  const [hashtagAtiva, setHashtagAtiva] = useState(null);
  const [carregando, setCarregando] = useState(API_ATIVA);
  const [enviando, setEnviando] = useState(false);
  const [aberto, setAberto] = useState(null);
  const [menu, setMenu] = useState(null);
  const fileRef = React.useRef(null);

  useEffect(() => { if (temaInicial) { setDraft(temaInicial); limparTema(); } }, [temaInicial, limparTema]);

  const carregar = useCallback(async () => {
    if (!API_ATIVA) return;
    try { setCarregando(true); setPosts(await api.feed(modo === 'seguindo' ? { modo: 'seguindo' } : {})); }
    catch (e) { showToast(e.message); } finally { setCarregando(false); }
  }, [showToast, modo, hashtagAtiva]);
  useEffect(() => { carregar(); }, [carregar]);

  const escolherFoto = (e) => {
    const fs = Array.from(e.target.files || []).slice(0, 6);
    fs.forEach((f) => comprimirImagem(f, (d) => setImagens((x) => [...x, d].slice(0, 6)), () => showToast('Não consegui ler essa imagem')));
    e.target.value = '';
  };

  const publicar = async () => {
    if (!draft.trim() && imagens.length === 0 && !enquete) return;
    if (!API_ATIVA) {
      setPosts((p) => [{ id: Date.now(), autor: { id: usuario.id, avatar_inicial: usuario.avatar_inicial, apelido: usuario.apelido }, grupo: { nome: 'Turma 6ºB' }, tempo: 'agora', texto: draft.trim(), imagens: imagens, reacoes: 0, por_tipo: {}, minha_reacao: null, comentarios: 0, salvo: false,
        enquete: enquete && enquete.opcoes.filter((o) => o.trim()).length >= 2 ? {
          id: Date.now(), pergunta: draft.trim() || 'Enquete', total: 0, meu_voto: null,
          opcoes: enquete.opcoes.filter((o) => o.trim()).map((t, i) => ({ id: i + 1, texto: t, votos: 0 })),
        } : null }, ...p]);
      setDraft(''); setImagens([]); setEnquete(null); showToast('Publicado no mural'); return;
    }
    try { setEnviando(true); const novo = await api.criarPost(null, draft.trim(), imagens, enquete); setPosts((p) => [novo, ...p]); setDraft(''); setImagens([]); setEnquete(null); showToast('Publicado no mural'); }
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
      <BarraStories usuario={usuario} showToast={showToast} />

      {hashtagAtiva && (
        <div className="tag-ativa">
          <span>#{hashtagAtiva}</span>
          <button onClick={() => setHashtagAtiva(null)}><Icon name="x" size={14} stroke={2.5} /> limpar</button>
        </div>
      )}
      <div className="feed-abas">
        <button className={modo === 'turma' ? 'is-on' : ''} onClick={() => setModo('turma')}>Da turma</button>
        <button className={modo === 'seguindo' ? 'is-on' : ''} onClick={() => setModo('seguindo')}>Quem eu sigo</button>
      </div>

      <div className="composer">
        <Avatar initial={usuario.avatar_inicial} foto={usuario.foto_url} size={40} badgeIcon={usuario.status_icone} />
        <div className="composer-body">
          <textarea className="composer-input" rows={2} value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={`No que você tá pensando, ${usuario.apelido}?`} />
          {imagens.length > 0 && (
            <div className="composer-fotos">
              {imagens.map((src, i) => (
                <div key={i} className="composer-foto">
                  <img src={src} alt="" />
                  <button onClick={() => setImagens((x) => x.filter((_, j) => j !== i))} aria-label="Remover"><Icon name="x" size={14} stroke={2.5} /></button>
                </div>
              ))}
            </div>
          )}
          {enquete && (
            <div className="composer-enquete">
              <div className="composer-enquete-head"><Icon name="grid" size={15} /> Enquete<button onClick={() => setEnquete(null)}><Icon name="x" size={15} /></button></div>
              {enquete.opcoes.map((o, i) => (
                <input key={i} className="input" value={o} placeholder={`Opção ${i + 1}`} onChange={(ev) => setEnquete({ ...enquete, opcoes: enquete.opcoes.map((x, j) => j === i ? ev.target.value : x) })} />
              ))}
              {enquete.opcoes.length < 4 && <button className="btn btn-ghost btn-sm" onClick={() => setEnquete({ ...enquete, opcoes: [...enquete.opcoes, ''] })}><Icon name="plus" size={14} stroke={3} /> Opção</button>}
            </div>
          )}
          <div className="composer-actions">
            <div className="composer-tools">
              <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={escolherFoto} />
              <button className="app-icon-btn" aria-label="Fotos" onClick={() => fileRef.current?.click()}><Icon name="photo" size={20} /></button>
              <button className={`app-icon-btn ${enquete ? 'is-on' : ''}`} aria-label="Enquete" onClick={() => setEnquete(enquete ? null : { pergunta: '', opcoes: ['', ''] })}><Icon name="grid" size={20} /></button>
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
          onReagir={reagir} onSalvar={salvar} onRemover={remover} onDenunciar={denunciar} abrirPerfil={abrirPerfil} abrirFoto={(src) => setFoto({ src, autor: p.autor.apelido })}
          onNovoComentario={() => setPosts((ps) => ps.map((x) => x.id === p.id ? { ...x, comentarios: x.comentarios + 1 } : x))}
          showToast={showToast} aoTocarTag={setHashtagAtiva}
          onEditar={(id, txt) => setPosts((ps) => ps.map((x) => x.id === id ? { ...x, texto: txt, editado: true } : x))} />
      ))}
      {!carregando && posts.length > 0 && <p className="feed-end">Você viu tudo por aqui.</p>}
      {foto && <Lightbox src={foto.src} autor={foto.autor} fechar={() => setFoto(null)} />}
    </div>
  );
}

function PostCard({ p, usuario, ehModerador, menuAberto, setMenu, comentariosAbertos, toggleComentarios, onReagir, onSalvar, onRemover, onDenunciar, abrirPerfil, onNovoComentario, showToast, abrirFoto, aoTocarTag, onEditar }) {
  const [picker, setPicker] = useState(false);
  const [editando, setEditando] = useState(false);
  const [rascunho, setRascunho] = useState(p.texto || '');
  const [verCurtidas, setVerCurtidas] = useState(false);
  const fotos = p.imagens?.length ? p.imagens : (p.imagem_url ? [p.imagem_url] : []);

  const salvarEdicao = async () => {
    setEditando(false);
    if (API_ATIVA) { try { await api.editarPost(p.id, rascunho); } catch (e) { showToast(e.message); return; } }
    onEditar?.(p.id, rascunho); showToast('Post editado');
  };
  const meu = p.autor?.id === usuario.id || p.autor?.apelido === usuario.apelido;
  const minha = p.minha_reacao;
  const tipos = Object.entries(p.por_tipo || {}).filter(([, n]) => n > 0).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([t]) => t);

  return (
    <article className="post">
      <div className="post-head">
        <button className="post-avatar-btn" onClick={() => p.autor?.id && abrirPerfil(p.autor.id)}><Avatar initial={p.autor.avatar_inicial} foto={p.autor.foto_url} size={42} /></button>
        <div className="post-who">
          <strong><button className="post-autor" onClick={() => p.autor?.id && abrirPerfil(p.autor.id)}>{p.autor.apelido}</button>{p.badge && <span className="post-badge"><Icon name="medal" size={11} stroke={2.5} />{p.badge}</span>}</strong>
          <span>{p.grupo?.nome} · {p.tempo}</span>
        </div>
        <div className="post-menu-wrap" onClick={(e) => e.stopPropagation()}>
          <button className="app-icon-btn" aria-label="Mais" onClick={() => setMenu(!menuAberto)}><Icon name="dots" size={20} /></button>
          {menuAberto && (
            <div className="post-menu">
              <button onClick={() => onSalvar(p.id)}><Icon name="star" size={16} /> {p.salvo ? 'Remover dos salvos' : 'Salvar post'}</button>
              {meu && <button onClick={() => { setMenu(false); setEditando(true); }}><Icon name="bulb" size={16} /> Editar post</button>}
              {(meu || ehModerador) && <button onClick={() => onRemover(p.id)} className="perigo"><Icon name="x" size={16} /> Remover post</button>}
              {!meu && <button onClick={() => onDenunciar(p.id)} className="perigo"><Icon name="flag" size={16} /> Denunciar</button>}
            </div>
          )}
        </div>
      </div>
      {editando ? (
        <div className="edit-post">
          <textarea className="composer-input" rows={3} value={rascunho} onChange={(e) => setRascunho(e.target.value)} />
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button className="btn btn-red btn-sm" onClick={salvarEdicao}><Icon name="check" size={15} stroke={3} /> Salvar</button>
            <button className="btn btn-ghost btn-sm" onClick={() => { setEditando(false); setRascunho(p.texto || ''); }}>Cancelar</button>
          </div>
        </div>
      ) : (
        <>{p.texto && <><TextoRico texto={p.texto} aoTocarTag={aoTocarTag} />{p.editado && <span className="post-editado">editado</span>}</>}</>
      )}
      {fotos.length > 0 && <Galeria imagens={fotos} aoAbrir={(i) => abrirFoto?.(fotos[i])} />}
      {p.enquete && <EnqueteBox enquete={p.enquete} showToast={showToast} />}
      {p.reacoes > 0 && (
        <div className="post-resumo">
          <button className="post-resumo-btn" onClick={() => setVerCurtidas(true)}>
            <span className="post-resumo-emojis">{tipos.map((t) => <span key={t}>{emojiDe(t)}</span>)}</span>
            <span>{p.reacoes}</span>
          </button>
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
      {verCurtidas && <QuemCurtiu postId={p.id} fechar={() => setVerCurtidas(false)} abrirPerfil={abrirPerfil} />}
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
      <button className="post-avatar-btn" onClick={() => c.autor?.id && abrirPerfil?.(c.autor.id)}><Avatar initial={c.autor.avatar_inicial} foto={c.autor.foto_url} size={filho ? 24 : 28} /></button>
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
          <Avatar initial={p.avatar_inicial} foto={p.foto_url} size={42} />
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
function PerfilOutro({ id, usuario, showToast, voltar, abrirChat, abrirPerfil }) {
  const [dados, setDados] = useState(null);
  const [posts, setPosts] = useState([]);
  const [seguindo, setSeguindo] = useState(false);
  const [aba, setAba] = useState('posts');
  const [foto, setFoto] = useState(null);
  const [verLista, setVerLista] = useState(null);

  useEffect(() => {
    if (!API_ATIVA) {
      setDados({ usuario: { id, apelido: 'Bel', avatar_inicial: 'B', status_icone: 'ball', bio: 'Amo futebol ⚽', pontos: 140 }, escola: 'Escola Doutor Blumenau', sou_eu: false, eu_sigo: false, stats: { posts: 12, curtidas: 48, pontos: 140, ranking: 1, seguidores: 8, seguindo: 5 }, medalhas: [{ icone: 'medal', titulo: 'Craque da semana' }] });
      setPosts(DEMO_POSTS.filter((p) => p.autor.apelido === 'Bel'));
      return;
    }
    api.perfil(id).then((d) => { setDados(d); setSeguindo(d.eu_sigo); }).catch((e) => showToast(e.message));
    api.feed({ usuarioId: id }).then(setPosts).catch(() => {});
  }, [id, showToast]);

  const toggleSeguir = async () => {
    setSeguindo((s) => !s);
    setDados((d) => d ? { ...d, stats: { ...d.stats, seguidores: d.stats.seguidores + (seguindo ? -1 : 1) } } : d);
    if (API_ATIVA) { try { const r = await api.seguir(id); setSeguindo(r.seguindo); } catch (e) { showToast(e.message); } }
    else showToast(seguindo ? 'Deixou de seguir' : 'Seguindo!');
  };

  if (!dados) return <p className="feed-end">Carregando perfil…</p>;
  const u = dados.usuario;
  const fotos = posts.filter((p) => p.imagem_url);
  const tones = ['gold', 'red', 'blue', 'green'];

  return (
    <div>
      <div className="perfil-topo">
        <button className="voltar-link" onClick={voltar}><Icon name="arrowLeft" size={16} /> Voltar</button>
      </div>
      <div className="profile-hero fachwerk" style={u.capa_url ? { backgroundImage: `linear-gradient(rgba(43,29,6,.25), rgba(43,29,6,.45)), url(${u.capa_url})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}>
        <div className="profile-avatar"><Avatar initial={u.avatar_inicial} foto={u.foto_url} size={88} badgeIcon={u.status_icone} /></div>
        <h2 className="h2" style={{ marginTop: 10 }}>{u.apelido}</h2>
        {u.bio && <p className="perfil-bio">{u.bio}</p>}
        <p className="profile-school">{dados.escola} · Pomerode</p>
        {!dados.sou_eu && (
          <div className="perfil-acoes">
            <button className={`btn btn-sm ${seguindo ? 'btn-ghost' : 'btn-red'}`} onClick={toggleSeguir}>
              {seguindo ? <><Icon name="check" size={15} stroke={3} /> Seguindo</> : <><Icon name="plus" size={15} stroke={3} /> Seguir</>}
            </button>
            <button className="btn btn-gold btn-sm" onClick={() => abrirChat?.(id)}><Icon name="chat" size={15} /> Mensagem</button>
          </div>
        )}
      </div>
      <div className="stats">
        {[[dados.stats.posts, 'Posts', null], [dados.stats.seguidores, 'Seguidores', 'seguidores'], [dados.stats.seguindo, 'Seguindo', 'seguindo'], [dados.stats.pontos, 'Pontos', null]].map(([n, l, tipo]) => (
          <button key={l} className="stat" onClick={() => tipo && setVerLista(tipo)} style={{ cursor: tipo ? 'pointer' : 'default' }}><strong>{n}</strong><span>{l}</span></button>
        ))}
      </div>
      <div className="pad">
        {dados.medalhas?.length > 0 && (<>
          <p className="label">Conquistas</p>
          <div className="badges">{dados.medalhas.map((m, i) => <div key={m.titulo} className="badge-card"><Tile icon={m.icone || 'medal'} tone={tones[i % 4]} size={36} radius={10} /><span>{m.titulo}</span></div>)}</div>
        </>)}
        <div className="perfil-abas">
          <button className={aba === 'posts' ? 'is-on' : ''} onClick={() => setAba('posts')}><Icon name="grid" size={16} /> Posts</button>
          <button className={aba === 'fotos' ? 'is-on' : ''} onClick={() => setAba('fotos')}><Icon name="photo" size={16} /> Fotos</button>
        </div>
        {aba === 'posts' && (<>
          {posts.length === 0 && <p className="coments-empty">Ainda não postou nada.</p>}
          {posts.map((p) => (
            <div key={p.id} className="mini-post">
              {p.texto && <p>{p.texto}</p>}
              {p.imagem_url && <img src={p.imagem_url} alt="" onClick={() => setFoto(p.imagem_url)} />}
              <span>{emojiDe(p.minha_reacao || 'curtida')} {p.reacoes} · {p.comentarios} comentários</span>
            </div>
          ))}
        </>)}
        {aba === 'fotos' && (<>
          {fotos.length === 0 && <p className="coments-empty">Nenhuma foto ainda.</p>}
          <div className="grade-fotos">
            {fotos.map((p) => (
              <button key={p.id} className="grade-item" onClick={() => setFoto(p.imagem_url)}>
                <img src={p.imagem_url} alt="" />
                <span><Icon name="heart" size={14} style={{ fill: 'currentColor' }} /> {p.reacoes}</span>
              </button>
            ))}
          </div>
        </>)}
        {foto && <Lightbox src={foto} autor={u.apelido} fechar={() => setFoto(null)} />}
        {verLista && <ListaPessoas titulo={verLista === 'seguidores' ? 'Seguidores' : 'Seguindo'} id={id} tipo={verLista} fechar={() => setVerLista(null)} abrirPerfil={abrirPerfil} />}
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
          <Avatar initial={r.usuario.avatar_inicial} foto={r.usuario.foto_url} size={36} />
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
  const [verLista, setVerLista] = useState(null);
  const fotoRef = React.useRef(null);
  const capaRef = React.useRef(null);

  const trocarImagem = (e, campo) => {
    const f = e.target.files?.[0]; if (!f) return;
    comprimirImagem(f, async (d) => {
      setUsuario({ ...usuario, [campo]: d });
      if (API_ATIVA) { try { await api.atualizarPerfil({ [campo]: d }); showToast?.(campo === 'foto_url' ? 'Foto atualizada' : 'Capa atualizada'); } catch (er) { showToast?.(er.message); } }
      else showToast?.(campo === 'foto_url' ? 'Foto atualizada' : 'Capa atualizada');
      setDados((x) => x ? { ...x, usuario: { ...x.usuario, [campo]: d } } : x);
    }, () => showToast?.('Não consegui ler a imagem'), campo === 'capa_url' ? 1600 : 600);
    e.target.value = '';
  };
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
      <div className="profile-hero fachwerk" style={usuario.capa_url ? { backgroundImage: `linear-gradient(rgba(43,29,6,.25), rgba(43,29,6,.45)), url(${usuario.capa_url})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}>
        <input ref={capaRef} type="file" accept="image/*" hidden onChange={(e) => trocarImagem(e, 'capa_url')} />
        <button className="trocar-capa" onClick={() => capaRef.current?.click()}><Icon name="camera" size={15} /> Capa</button>
        <div className="profile-avatar" style={{ position: 'relative' }}>
          <Avatar initial={usuario.avatar_inicial} foto={usuario.foto_url} size={88} badgeIcon={status} />
          <input ref={fotoRef} type="file" accept="image/*" hidden onChange={(e) => trocarImagem(e, 'foto_url')} />
          <button className="trocar-foto" onClick={() => fotoRef.current?.click()} aria-label="Trocar foto"><Icon name="camera" size={14} /></button>
        </div>
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
        {[[stats.posts, 'Posts', null], [stats.seguidores ?? 0, 'Seguidores', 'seguidores'], [stats.seguindo ?? 0, 'Seguindo', 'seguindo'], [stats.pontos, 'Pontos', null]].map(([n, l, tipo]) => (
          <button key={l} className="stat" onClick={() => tipo && setVerLista(tipo)} style={{ cursor: tipo ? 'pointer' : 'default' }}><strong>{n}</strong><span>{l}</span></button>
        ))}
      </div>
      <div className="pad">
        <p className="label">Status do dia</p>
        <div className="status-grid">{STATUS.map((s) => <button key={s} onClick={() => trocarStatus(s)} className={`status-btn ${status === s ? 'is-active' : ''}`} aria-label={s}><Icon name={s} size={22} /></button>)}</div>
        <p className="label" style={{ marginTop: 22 }}>Conquistas</p>
        {medalhas.length === 0 && <p className="coments-empty">Jogue os desafios pra ganhar medalhas.</p>}
        <div className="badges">{medalhas.map((m, i) => <div key={m.titulo} className="badge-card"><Tile icon={m.icone || 'medal'} tone={tones[i % 4]} size={36} radius={10} /><span>{m.titulo}</span></div>)}</div>
        <p className="label" style={{ marginTop: 22 }}>Acessibilidade</p>
        <div className="acess-card">
          <div className="acess-topo">
            <Tile icon="chat" tone={usuario.comunicacao_assistiva ? 'solidRed' : 'gold'} size={40} radius={12} />
            <div>
              <strong>Fala Comigo</strong>
              <span>Comunicação assistiva por cartões</span>
            </div>
            <button className={`btn btn-sm ${usuario.comunicacao_assistiva ? 'btn-ghost' : 'btn-red'}`} onClick={async () => {
              const novo = !usuario.comunicacao_assistiva;
              setUsuario({ ...usuario, comunicacao_assistiva: novo });
              if (API_ATIVA) { try { await api.falaConfig({ ativo: novo }); } catch (e) { showToast?.(e.message); } }
              showToast?.(novo ? 'Fala Comigo ativado' : 'Fala Comigo desativado');
            }}>{usuario.comunicacao_assistiva ? 'Ativado' : 'Ativar'}</button>
          </div>
          <p className="acess-txt">Toque nos desenhos para falar. A coordenação é avisada quando você pede ajuda.</p>
          <a className="acess-link" href="https://falacomigo.unicontroller.com.br" target="_blank" rel="noreferrer">
            <Icon name="arrowRight" size={15} /> Abrir o app FalaComigo completo
          </a>
        </div>

        <button className="btn btn-ghost btn-block" style={{ marginTop: 22 }} onClick={onLogout}><Icon name="logout" size={18} /> Sair</button>
        <p className="profile-credit">Criado por <strong>Thiago Tomelin</strong></p>
      </div>
      {verLista && <ListaPessoas titulo={verLista === 'seguidores' ? 'Seguidores' : 'Seguindo'} id={usuario.id} tipo={verLista} fechar={() => setVerLista(null)} />}
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

/* ===================== CONVERSAS (lista) ===================== */
const DEMO_CONVERSAS = [
  { id: 1, com: { id: 12, apelido: 'Bel', avatar_inicial: 'B' }, ultima: { texto: '18h no campo da escola', minha: false, tempo: '5 min' }, nao_lidas: 2 },
  { id: 2, com: { id: 14, apelido: 'Théo', avatar_inicial: 'T' }, ultima: { texto: 'A 5, não entendi os artigos', minha: false, tempo: '40 min' }, nao_lidas: 1 },
  { id: 3, com: { id: 13, apelido: 'Lucas', avatar_inicial: 'L' }, ultima: { texto: 'Já tô entrando', minha: true, tempo: '2 h' }, nao_lidas: 0 },
  { id: 4, com: { id: 16, apelido: 'Helena', avatar_inicial: 'H' }, ultima: { texto: 'Valeu pela ajuda no trabalho!', minha: false, tempo: '1 d' }, nao_lidas: 0 },
];
const DEMO_MENSAGENS = {
  1: [
    { id: 1, texto: 'Oi Marco! Viu o jogo de sábado?', minha: false, tempo: '3 h' },
    { id: 2, texto: 'Vi sim! Que golaço no final 😱', minha: true, tempo: '3 h' },
    { id: 3, texto: 'Bora jogar hoje depois da aula?', minha: false, tempo: '1 h' },
    { id: 4, texto: 'Bora! Que horas?', minha: true, tempo: '30 min' },
    { id: 5, texto: '18h no campo da escola', minha: false, tempo: '5 min' },
  ],
  2: [
    { id: 6, texto: 'Marco, me ajuda no exercício de alemão?', minha: false, tempo: '1 h' },
    { id: 7, texto: 'Claro! Qual questão?', minha: true, tempo: '50 min' },
    { id: 8, texto: 'A 5, não entendi os artigos', minha: false, tempo: '40 min' },
  ],
  3: [
    { id: 9, texto: 'Servidor tá on', minha: false, tempo: '3 h' },
    { id: 10, texto: 'Já tô entrando', minha: true, tempo: '2 h' },
  ],
  4: [
    { id: 11, texto: 'Consegui terminar o desenho!', minha: false, tempo: '1 d' },
    { id: 12, texto: 'Ficou muito bom mesmo 👏', minha: true, tempo: '1 d' },
    { id: 13, texto: 'Valeu pela ajuda no trabalho!', minha: false, tempo: '1 d' },
  ],
};

function Conversas({ abrirChat, abrirBusca, showToast }) {
  const [lista, setLista] = useState(API_ATIVA ? null : DEMO_CONVERSAS);

  const carregar = useCallback(async () => {
    if (!API_ATIVA) return;
    try { setLista(await api.conversas()); } catch (e) { showToast(e.message); setLista([]); }
  }, [showToast]);
  useEffect(() => { carregar(); }, [carregar]);

  return (
    <div className="pad">
      <div className="jogos-head">
        <div><h2 className="h2">Mensagens</h2><p className="sub" style={{ margin: 0 }}>Converse com a turma.</p></div>
        <button className="btn btn-gold btn-sm" onClick={abrirBusca}><Icon name="plus" size={16} stroke={2.5} /> Nova</button>
      </div>
      {lista === null && <p className="feed-end">Carregando…</p>}
      {lista && lista.length === 0 && (
        <div className="mod-empty" style={{ background: 'var(--gold-light)', color: 'var(--gold-text)' }}>
          <Icon name="chat" size={22} /> Nenhuma conversa ainda. Busque um colega para começar.
        </div>
      )}
      {lista && lista.map((c) => (
        <button key={c.id} className="conv-row" onClick={() => abrirChat(c.id)}>
          <Avatar initial={c.com.avatar_inicial} foto={c.com.foto_url} size={48} />
          <div className="conv-body">
            <strong>{c.com.apelido}</strong>
            <span>{c.ultima ? `${c.ultima.minha ? 'Você: ' : ''}${c.ultima.texto}` : 'Diga oi!'}</span>
          </div>
          <div className="conv-meta">
            <em>{c.ultima?.tempo || ''}</em>
            {c.nao_lidas > 0 && <span className="conv-badge">{c.nao_lidas}</span>}
          </div>
        </button>
      ))}
    </div>
  );
}

/* ===================== CHAT (conversa aberta) ===================== */
function Chat({ conversaId, usuario, showToast, voltar }) {
  const [com, setCom] = useState(null);
  const [msgs, setMsgs] = useState(API_ATIVA ? null : (DEMO_MENSAGENS[conversaId] || []));
  const [texto, setTexto] = useState('');
  const [imagem, setImagem] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const fimRef = React.useRef(null);
  const fileRef = React.useRef(null);

  const carregar = useCallback(async () => {
    if (!API_ATIVA) { setCom(DEMO_CONVERSAS.find((c) => c.id === conversaId)?.com || { apelido: 'Bel', avatar_inicial: 'B' }); return; }
    try { const r = await api.mensagens(conversaId); setCom(r.com); setMsgs(r.mensagens); }
    catch (e) { showToast(e.message); setMsgs([]); }
  }, [conversaId, showToast]);

  useEffect(() => { carregar(); }, [carregar]);
  // "tempo real": recarrega a cada 4s enquanto a tela está aberta
  useEffect(() => {
    if (!API_ATIVA) return;
    const t = setInterval(carregar, 4000);
    return () => clearInterval(t);
  }, [carregar]);
  useEffect(() => { fimRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);

  const enviar = async () => {
    if (!texto.trim() && !imagem) return;
    const t = texto.trim(); const img = imagem;
    setTexto(''); setImagem(null);
    if (!API_ATIVA) { setMsgs((m) => [...(m || []), { id: Date.now(), texto: t, imagem_url: img, minha: true, tempo: 'agora' }]); return; }
    try { setEnviando(true); const m = await api.enviarMensagem(conversaId, t, img); setMsgs((x) => [...(x || []), m]); }
    catch (e) { showToast(e.message); setTexto(t); } finally { setEnviando(false); }
  };

  const fotoChat = (e) => {
    const f = e.target.files?.[0]; if (!f) return;
    comprimirImagem(f, setImagem, () => showToast('Não consegui ler a imagem'), 900);
    e.target.value = '';
  };

  return (
    <div className="chat">
      <div className="chat-topo">
        <button className="app-icon-btn" onClick={voltar} aria-label="Voltar"><Icon name="arrowLeft" size={20} /></button>
        {com && <><Avatar initial={com.avatar_inicial} foto={com.foto_url} size={38} /><strong>{com.apelido}</strong></>}
      </div>
      <div className="chat-msgs">
        {msgs === null && <p className="feed-end">Carregando…</p>}
        {msgs && msgs.length === 0 && <p className="coments-empty" style={{ textAlign: 'center', padding: 20 }}>Nenhuma mensagem ainda. Diga oi!</p>}
        {msgs && msgs.map((m) => (
          <div key={m.id} className={`bolha ${m.minha ? 'minha' : ''}`}>
            {m.imagem_url && <img className="bolha-img" src={m.imagem_url} alt="" />}
            {m.texto && <p>{m.texto}</p>}<em>{m.tempo}</em>
          </div>
        ))}
        <div ref={fimRef} />
      </div>
      {imagem && <div className="chat-previa"><img src={imagem} alt="" /><button onClick={() => setImagem(null)}><Icon name="x" size={14} stroke={2.5} /></button></div>}
      <div className="chat-form">
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={fotoChat} />
        <button className="app-icon-btn" onClick={() => fileRef.current?.click()} aria-label="Foto"><Icon name="photo" size={20} /></button>
        <input className="input" value={texto} onChange={(e) => setTexto(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && enviar()} placeholder="Escreva uma mensagem…" />
        <button className="btn btn-red btn-sm" onClick={enviar} disabled={enviando}><Icon name="send" size={16} /></button>
      </div>
    </div>
  );
}

/* ===================== VISUALIZADOR DE FOTO (lightbox) ===================== */
function Lightbox({ src, autor, fechar }) {
  useEffect(() => {
    const esc = (e) => e.key === 'Escape' && fechar();
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [fechar]);
  return (
    <div className="lightbox" onClick={fechar}>
      <button className="lightbox-x" onClick={fechar} aria-label="Fechar"><Icon name="x" size={24} stroke={2.5} /></button>
      <img src={src} alt="" onClick={(e) => e.stopPropagation()} />
      {autor && <p className="lightbox-autor">{autor}</p>}
    </div>
  );
}

/* ===================== STORIES ===================== */
const DEMO_STORIES = [
  { usuario: { id: 12, apelido: 'Bel', avatar_inicial: 'B' }, sou_eu: false, todos_vistos: false, stories: [
    { id: 1, texto: 'Treino hoje às 18h! Bora ⚽', cor_fundo: '#C62828', tempo: '2 h', visto: false },
    { id: 2, imagem_url: FOTOS.futebol, texto: 'Campo pronto!', tempo: '1 h', visto: false }] },
  { usuario: { id: 16, apelido: 'Helena', avatar_inicial: 'H' }, sou_eu: false, todos_vistos: false, stories: [
    { id: 3, imagem_url: FOTOS.arte, texto: 'Desenho de hoje 🎨', tempo: '3 h', visto: false }] },
  { usuario: { id: 14, apelido: 'Théo', avatar_inicial: 'T' }, sou_eu: false, todos_vistos: false, stories: [
    { id: 4, texto: 'Guten Morgen, turma! 🇩🇪', cor_fundo: '#2E86C1', tempo: '4 h', visto: false }] },
  { usuario: { id: 18, apelido: 'Larissa', avatar_inicial: 'L' }, sou_eu: false, todos_vistos: false, stories: [
    { id: 5, texto: 'Prova de mat amanhã, bora estudar 📐', cor_fundo: '#8E44AD', tempo: '5 h', visto: false }] },
  { usuario: { id: 13, apelido: 'Lucas', avatar_inicial: 'L' }, sou_eu: false, todos_vistos: true, stories: [
    { id: 6, texto: 'Servidor novo no ar 🎮', cor_fundo: '#5B8C2A', tempo: '8 h', visto: true }] },
];

function BarraStories({ usuario, showToast, recarregar }) {
  const [grupos, setGrupos] = useState(API_ATIVA ? [] : DEMO_STORIES);
  const [vendo, setVendo] = useState(null);   // índice do grupo aberto
  const [criando, setCriando] = useState(false);

  const carregar = useCallback(async () => {
    if (!API_ATIVA) return;
    try { setGrupos(await api.stories()); } catch (e) { /* silencioso */ }
  }, []);
  useEffect(() => { carregar(); }, [carregar]);

  const meu = grupos.find((g) => g.sou_eu);
  const outros = grupos.filter((g) => !g.sou_eu);

  return (
    <>
      <div className="stories">
        <button className="story" onClick={() => meu ? setVendo(grupos.indexOf(meu)) : setCriando(true)}>
          <div className={meu ? 'story-ring-meu' : 'story-add'}>
            {meu ? <Avatar initial={usuario.avatar_inicial} foto={usuario.foto_url} size={46} /> : <Icon name="plus" size={18} stroke={2.5} />}
          </div>
          <span>Seu story</span>
        </button>
        {meu && <button className="story story-add-mini" onClick={() => setCriando(true)}><div className="story-add"><Icon name="plus" size={16} stroke={2.5} /></div><span>Novo</span></button>}
        {outros.map((g) => (
          <button key={g.usuario.id} className="story" onClick={() => setVendo(grupos.indexOf(g))}>
            <div className={g.todos_vistos ? 'story-visto' : 'story-ring'}><Avatar initial={g.usuario.avatar_inicial} foto={g.usuario.foto_url} size={46} /></div>
            <span>{g.usuario.apelido}</span>
          </button>
        ))}
        {grupos.length === 0 && <span className="stories-vazio">Poste o primeiro story da turma!</span>}
      </div>

      {criando && <CriarStory usuario={usuario} fechar={() => setCriando(false)} aoCriar={() => { setCriando(false); carregar(); showToast('Story publicado! Some em 24h'); }} showToast={showToast} />}
      {vendo !== null && <VerStories grupos={grupos} inicio={vendo} fechar={() => { setVendo(null); carregar(); }} />}
    </>
  );
}

const CORES_STORY = ['#F7B500', '#C62828', '#2E86C1', '#5B8C2A', '#8E44AD', '#2B1D06'];

function CriarStory({ usuario, fechar, aoCriar, showToast }) {
  const [texto, setTexto] = useState('');
  const [imagens, setImagens] = useState([]);
  const [enquete, setEnquete] = useState(null);
  const [hashtagAtiva, setHashtagAtiva] = useState(null);
  const [cor, setCor] = useState('#F7B500');
  const [enviando, setEnviando] = useState(false);
  const fileRef = React.useRef(null);

  const escolher = (e) => {
    const f = e.target.files?.[0]; if (!f) return;
    comprimirImagem(f, (dataUrl) => setImagem(dataUrl), () => showToast('Não consegui ler essa imagem'));
    e.target.value = '';
  };

  const publicar = async () => {
    if (!texto.trim() && !imagem) { showToast('Escreva algo ou escolha uma foto'); return; }
    if (!API_ATIVA) { aoCriar(); return; }
    try { setEnviando(true); await api.criarStory(imagem, texto.trim(), cor); aoCriar(); }
    catch (e) { showToast(e.message); } finally { setEnviando(false); }
  };

  return (
    <div className="story-modal">
      <div className="story-modal-card">
        <div className="story-modal-head">
          <strong>Novo story</strong>
          <button className="app-icon-btn" onClick={fechar} aria-label="Fechar"><Icon name="x" size={20} /></button>
        </div>
        <div className="story-previa" style={{ background: imagem ? '#000' : cor }}>
          {imagem ? <img src={imagem} alt="" /> : <p>{texto || 'Seu story aparece aqui'}</p>}
        </div>
        <input className="input" value={texto} maxLength={120} onChange={(e) => setTexto(e.target.value)} placeholder="Escreva algo…" style={{ marginTop: 12 }} />
        {!imagem && (
          <div className="story-cores">
            {CORES_STORY.map((c) => <button key={c} className={`story-cor ${cor === c ? 'is-on' : ''}`} style={{ background: c }} onClick={() => setCor(c)} aria-label={c} />)}
          </div>
        )}
        <div className="story-modal-acoes">
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={escolher} />
          <button className="btn btn-ghost btn-sm" onClick={() => imagem ? setImagem(null) : fileRef.current?.click()}>
            <Icon name="photo" size={16} /> {imagem ? 'Remover foto' : 'Foto'}
          </button>
          <button className="btn btn-red btn-sm" onClick={publicar} disabled={enviando}><Icon name="send" size={16} /> Publicar</button>
        </div>
        <p className="story-nota">Seu story some sozinho depois de 24 horas.</p>
      </div>
    </div>
  );
}

function VerStories({ grupos, inicio, fechar }) {
  const [gi, setGi] = useState(inicio);
  const [si, setSi] = useState(0);
  const grupo = grupos[gi];
  const story = grupo?.stories[si];

  const avancar = useCallback(() => {
    if (!grupo) return fechar();
    if (si + 1 < grupo.stories.length) setSi(si + 1);
    else if (gi + 1 < grupos.length) { setGi(gi + 1); setSi(0); }
    else fechar();
  }, [grupo, si, gi, grupos.length, fechar]);

  const voltar = () => {
    if (si > 0) setSi(si - 1);
    else if (gi > 0) { setGi(gi - 1); setSi(0); }
  };

  useEffect(() => {
    if (story && API_ATIVA) api.verStory(story.id).catch(() => {});
    const t = setTimeout(avancar, 5000);
    const esc = (e) => { if (e.key === 'Escape') fechar(); if (e.key === 'ArrowRight') avancar(); if (e.key === 'ArrowLeft') voltar(); };
    window.addEventListener('keydown', esc);
    return () => { clearTimeout(t); window.removeEventListener('keydown', esc); };
  }, [story, avancar, fechar]); // eslint-disable-line

  if (!story) return null;

  return (
    <div className="story-viewer">
      <div className="story-barras">
        {grupo.stories.map((_, i) => <span key={i} className={i < si ? 'cheia' : i === si ? 'ativa' : ''} />)}
      </div>
      <div className="story-viewer-head">
        <Avatar initial={grupo.usuario.avatar_inicial} foto={grupo.usuario.foto_url} size={34} />
        <strong>{grupo.usuario.apelido}</strong>
        <em>{story.tempo}</em>
        <button className="app-icon-btn" onClick={fechar} aria-label="Fechar" style={{ marginLeft: 'auto', color: '#fff' }}><Icon name="x" size={22} /></button>
      </div>
      <div className="story-conteudo" style={{ background: story.imagem_url ? '#000' : story.cor_fundo }}>
        {story.imagem_url ? <img src={story.imagem_url} alt="" /> : <p>{story.texto}</p>}
        {story.imagem_url && story.texto && <div className="story-legenda">{story.texto}</div>}
      </div>
      <button className="story-nav esq" onClick={voltar} aria-label="Anterior" />
      <button className="story-nav dir" onClick={avancar} aria-label="Próximo" />
    </div>
  );
}

/* ===================== GALERIA (várias fotos no post) ===================== */
function Galeria({ imagens, aoAbrir }) {
  const n = imagens.length;
  if (n === 0) return null;
  if (n === 1) return <button className="post-img" onClick={() => aoAbrir(0)}><img src={imagens[0]} alt="" /></button>;
  return (
    <div className={`galeria g${Math.min(n, 4)}`}>
      {imagens.slice(0, 4).map((src, i) => (
        <button key={i} className="galeria-item" onClick={() => aoAbrir(i)}>
          <img src={src} alt="" />
          {i === 3 && n > 4 && <span className="galeria-mais">+{n - 4}</span>}
        </button>
      ))}
    </div>
  );
}

/* ===================== ENQUETE ===================== */
function EnqueteBox({ enquete, showToast }) {
  const [dados, setDados] = useState(enquete);
  const [votando, setVotando] = useState(false);
  const total = dados.total || 0;

  const votar = async (opcaoId) => {
    if (dados.meu_voto) return;
    if (!API_ATIVA) {
      const opcoes = dados.opcoes.map((o) => o.id === opcaoId ? { ...o, votos: o.votos + 1 } : o);
      setDados({ ...dados, opcoes, total: total + 1, meu_voto: opcaoId });
      showToast('Voto registrado'); return;
    }
    try { setVotando(true); const r = await api.votar(dados.id, opcaoId); setDados({ ...dados, ...r }); showToast('Voto registrado'); }
    catch (e) { showToast(e.message); } finally { setVotando(false); }
  };

  return (
    <div className="enquete">
      <p className="enquete-pergunta"><Icon name="grid" size={15} /> {dados.pergunta}</p>
      {dados.opcoes.map((o) => {
        const pct = total > 0 ? Math.round((o.votos / total) * 100) : 0;
        const meu = dados.meu_voto === o.id;
        return (
          <button key={o.id} className={`enquete-opcao ${dados.meu_voto ? 'votada' : ''} ${meu ? 'is-minha' : ''}`} onClick={() => votar(o.id)} disabled={!!dados.meu_voto || votando}>
            {dados.meu_voto && <span className="enquete-barra" style={{ width: `${pct}%` }} />}
            <span className="enquete-texto">{o.texto}{meu && <Icon name="check" size={14} stroke={3} />}</span>
            {dados.meu_voto && <span className="enquete-pct">{pct}%</span>}
          </button>
        );
      })}
      <p className="enquete-total">{total} voto{total !== 1 ? 's' : ''}{!dados.meu_voto && ' · toque para votar'}</p>
    </div>
  );
}

/* ===================== QUEM CURTIU ===================== */
function QuemCurtiu({ postId, fechar, abrirPerfil }) {
  const [lista, setLista] = useState(API_ATIVA ? null : [
    { tipo: 'amei', usuario: { id: 12, apelido: 'Bel', avatar_inicial: 'B' } },
    { tipo: 'risada', usuario: { id: 13, apelido: 'Lucas', avatar_inicial: 'L' } },
  ]);
  useEffect(() => { if (API_ATIVA) api.curtidasDo(postId).then(setLista).catch(() => setLista([])); }, [postId]);
  return (
    <div className="story-modal" onClick={fechar}>
      <div className="story-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="story-modal-head"><strong>Quem reagiu</strong><button className="app-icon-btn" onClick={fechar}><Icon name="x" size={20} /></button></div>
        {lista === null && <p className="coments-empty">Carregando…</p>}
        {lista && lista.length === 0 && <p className="coments-empty">Ninguém ainda.</p>}
        {lista && lista.map((r, i) => (
          <button key={i} className="curtiu-linha" onClick={() => { fechar(); abrirPerfil?.(r.usuario.id); }}>
            <Avatar initial={r.usuario.avatar_inicial} foto={r.usuario.foto_url} size={38} />
            <strong>{r.usuario.apelido}</strong>
            <span className="curtiu-emoji">{emojiDe(r.tipo)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ===================== LISTA DE SEGUIDORES / SEGUINDO ===================== */
function ListaPessoas({ titulo, id, tipo, fechar, abrirPerfil }) {
  const [lista, setLista] = useState(API_ATIVA ? null : [{ id: 12, apelido: 'Bel', avatar_inicial: 'B', bio: 'Craque do futebol' }]);
  useEffect(() => {
    if (!API_ATIVA) return;
    const f = tipo === 'seguidores' ? api.seguidoresDe : api.seguindoDe;
    f(id).then(setLista).catch(() => setLista([]));
  }, [id, tipo]);
  return (
    <div className="story-modal" onClick={fechar}>
      <div className="story-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="story-modal-head"><strong>{titulo}</strong><button className="app-icon-btn" onClick={fechar}><Icon name="x" size={20} /></button></div>
        {lista === null && <p className="coments-empty">Carregando…</p>}
        {lista && lista.length === 0 && <p className="coments-empty">Ninguém por aqui ainda.</p>}
        {lista && lista.map((u) => (
          <button key={u.id} className="curtiu-linha" onClick={() => { fechar(); abrirPerfil?.(u.id); }}>
            <Avatar initial={u.avatar_inicial} foto={u.foto_url} size={38} />
            <div style={{ flex: 1, textAlign: 'left' }}><strong>{u.apelido}</strong>{u.bio && <p className="lista-bio">{u.bio}</p>}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ===================== DESCOBRIR (sugestões + hashtags) ===================== */
function Descobrir({ abrirPerfil, showToast, verHashtag }) {
  const [dados, setDados] = useState(API_ATIVA ? null : {
    pessoas: [{ id: 13, apelido: 'Lucas', avatar_inicial: 'L', bio: 'Servidor sempre on', seguidores: 4, pontos: 110 },
              { id: 14, apelido: 'Théo', avatar_inicial: 'T', seguidores: 2, pontos: 60 }],
    hashtags: [{ nome: 'futebol', usos: 12 }, { nome: 'turma6b', usos: 8 }, { nome: 'games', usos: 5 }],
  });
  const [seguindo, setSeguindo] = useState({});

  useEffect(() => { if (API_ATIVA) api.descobrir().then(setDados).catch(() => setDados({ pessoas: [], hashtags: [] })); }, []);

  const seguir = async (id) => {
    setSeguindo((s) => ({ ...s, [id]: !s[id] }));
    if (API_ATIVA) { try { await api.seguir(id); } catch (e) { showToast(e.message); } }
    else showToast('Seguindo!');
  };

  if (!dados) return <p className="feed-end">Carregando…</p>;

  return (
    <div className="pad">
      <h2 className="h2">Descobrir</h2>
      <p className="sub">Pessoas e assuntos da escola.</p>

      {dados.hashtags?.length > 0 && (<>
        <p className="label">Em alta</p>
        <div className="tags-alta">
          {dados.hashtags.map((h) => (
            <button key={h.nome} className="tag-chip" onClick={() => verHashtag(h.nome)}>#{h.nome} <em>{h.usos}</em></button>
          ))}
        </div>
      </>)}

      <p className="label" style={{ marginTop: 20 }}>Quem seguir</p>
      {dados.pessoas.length === 0 && <p className="coments-empty">Você já segue todo mundo!</p>}
      {dados.pessoas.map((u) => (
        <div key={u.id} className="row-card">
          <button className="post-avatar-btn" onClick={() => abrirPerfil(u.id)}><Avatar initial={u.avatar_inicial} foto={u.foto_url} size={46} /></button>
          <button className="row-card-body" style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }} onClick={() => abrirPerfil(u.id)}>
            <strong>{u.apelido}</strong>
            <span>{u.bio || `${u.seguidores || 0} seguidores · ${u.pontos || 0} pts`}</span>
          </button>
          <button className={`btn btn-sm ${seguindo[u.id] ? 'btn-ghost' : 'btn-red'}`} onClick={() => seguir(u.id)}>
            {seguindo[u.id] ? <><Icon name="check" size={15} stroke={3} /> Seguindo</> : 'Seguir'}
          </button>
        </div>
      ))}
    </div>
  );
}

/* texto com @mencoes e #hashtags destacados */
function TextoRico({ texto, aoTocarTag }) {
  if (!texto) return null;
  const partes = texto.split(/(@[A-Za-zÀ-ÿ0-9_]{2,20}|#[A-Za-zÀ-ÿ0-9_]{2,30})/g);
  return (
    <p className="post-text">
      {partes.map((t, i) => {
        if (t.startsWith('@')) return <b key={i} className="mencao">{t}</b>;
        if (t.startsWith('#')) return <button key={i} className="hashtag" onClick={() => aoTocarTag?.(t.slice(1))}>{t}</button>;
        return <span key={i}>{t}</span>;
      })}
    </p>
  );
}

/* ===================== AVISOS DA ESCOLA ===================== */
const DEMO_AVISOS = [
  { id: 1, titulo: 'Reunião de Pais e Alunos — 3º Trimestre', corpo: 'Convocamos os responsáveis pelos alunos do Ensino Fundamental II para o encontro no auditório na próxima quinta-feira às 19h.', categoria: 'reuniao', fixado: true, autor: { apelido: 'Coordenação', avatar_inicial: 'C' }, tempo: '2 h', lido: false },
  { id: 2, titulo: 'Preparativos para a Osterfest Escolar 2026', corpo: 'Lembramos todas as turmas do 6º ao 9º ano que as inscrições para as oficinas de pintura de casquinhas (Ostereier) encerram nesta sexta-feira!', categoria: 'evento', fixado: false, autor: { apelido: 'Coordenação', avatar_inicial: 'C' }, tempo: '1 d', lido: true },
  { id: 3, titulo: 'Inscrições para a Rota do Enxaimel de Ciclismo Escolar', corpo: 'Garanta sua camiseta oficial do evento no departamento de Educação Física.', categoria: 'esporte', fixado: false, autor: { apelido: 'Prof. Klaus', avatar_inicial: 'K' }, tempo: '3 d', lido: true },
];
const CAT_AVISO = {
  geral:   { icone: 'flag',   tone: 'gold',  rotulo: 'Geral' },
  evento:  { icone: 'star',   tone: 'red',   rotulo: 'Evento' },
  reuniao: { icone: 'users',  tone: 'blue',  rotulo: 'Reunião' },
  esporte: { icone: 'ball',   tone: 'green', rotulo: 'Esporte' },
  prova:   { icone: 'book',   tone: 'red',   rotulo: 'Prova' },
};

function Avisos({ usuario, showToast }) {
  const [lista, setLista] = useState(API_ATIVA ? null : DEMO_AVISOS);
  const [criando, setCriando] = useState(false);
  const [form, setForm] = useState({ titulo: '', corpo: '', categoria: 'geral', turma_alvo: '', fixado: false });
  const ehMod = usuario.papel === 'responsavel' || usuario.papel === 'admin';

  const carregar = useCallback(async () => {
    if (!API_ATIVA) return;
    try { setLista(await api.avisos()); } catch (e) { showToast(e.message); setLista([]); }
  }, [showToast]);
  useEffect(() => { carregar(); }, [carregar]);

  const publicar = async () => {
    if (!form.titulo.trim() || !form.corpo.trim()) { showToast('Preencha título e mensagem'); return; }
    if (!API_ATIVA) {
      setLista((l) => [{ id: Date.now(), ...form, autor: { apelido: usuario.apelido, avatar_inicial: usuario.avatar_inicial }, tempo: 'agora', lido: true }, ...l]);
    } else {
      try { await api.criarAviso(form); await carregar(); } catch (e) { showToast(e.message); return; }
    }
    setForm({ titulo: '', corpo: '', categoria: 'geral', turma_alvo: '', fixado: false });
    setCriando(false); showToast('Aviso publicado');
  };

  const marcarLido = async (a) => {
    if (a.lido) return;
    setLista((l) => l.map((x) => x.id === a.id ? { ...x, lido: true } : x));
    if (API_ATIVA) { try { await api.lerAviso(a.id); } catch (e) { /* silencioso */ } }
  };

  return (
    <div className="pad">
      <div className="jogos-head">
        <div><h2 className="h2">Avisos da escola</h2><p className="sub" style={{ margin: 0 }}>Comunicados oficiais da coordenação.</p></div>
        {ehMod && <button className="btn btn-gold btn-sm" onClick={() => setCriando(!criando)}><Icon name="plus" size={16} stroke={2.5} /> Novo</button>}
      </div>

      {criando && (
        <div className="criar-grupo">
          <input className="input" placeholder="Título do aviso" value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} style={{ marginBottom: 8 }} />
          <textarea className="composer-input" rows={3} placeholder="Mensagem" value={form.corpo} onChange={(e) => setForm({ ...form, corpo: e.target.value })} />
          <p className="label" style={{ margin: '12px 0 8px' }}>Categoria</p>
          <div className="cat-grid">
            {Object.entries(CAT_AVISO).map(([k, v]) => (
              <button key={k} className={`cat-btn ${form.categoria === k ? 'is-on' : ''}`} onClick={() => setForm({ ...form, categoria: k })}>
                <Icon name={v.icone} size={16} /> {v.rotulo}
              </button>
            ))}
          </div>
          <input className="input" placeholder="Turma (vazio = todas)" value={form.turma_alvo} onChange={(e) => setForm({ ...form, turma_alvo: e.target.value })} style={{ marginTop: 10 }} />
          <label className="fixar-check"><input type="checkbox" checked={form.fixado} onChange={(e) => setForm({ ...form, fixado: e.target.checked })} /> Fixar no topo</label>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button className="btn btn-red btn-sm" onClick={publicar}><Icon name="send" size={15} /> Publicar</button>
            <button className="btn btn-ghost btn-sm" onClick={() => setCriando(false)}>Cancelar</button>
          </div>
        </div>
      )}

      {lista === null && <p className="feed-end">Carregando…</p>}
      {lista && lista.length === 0 && <div className="mod-empty"><Icon name="check" size={22} /> Nenhum aviso no momento.</div>}
      {lista && lista.map((a) => {
        const cat = CAT_AVISO[a.categoria] || CAT_AVISO.geral;
        return (
          <article key={a.id} className={`aviso ${a.lido ? '' : 'nao-lido'}`} onClick={() => marcarLido(a)}>
            <div className="aviso-topo">
              <Tile icon={cat.icone} tone={cat.tone} size={40} radius={12} />
              <div className="aviso-meta">
                <div className="aviso-tags">
                  <span className={`aviso-cat cat-${a.categoria}`}>{cat.rotulo}</span>
                  {a.fixado && <span className="aviso-fix"><Icon name="star" size={11} style={{ fill: 'currentColor' }} /> Fixado</span>}
                  {a.turma_alvo && <span className="aviso-turma">{a.turma_alvo}</span>}
                  {!a.lido && <span className="aviso-novo">novo</span>}
                </div>
                <h3>{a.titulo}</h3>
                <span className="aviso-autor">{a.autor?.apelido} · {a.tempo}</span>
              </div>
            </div>
            <p className="aviso-corpo">{a.corpo}</p>
          </article>
        );
      })}
    </div>
  );
}

/* ===================== BOLETIM ===================== */
const DEMO_BOLETIM = {
  aluno: { apelido: 'Marco', avatar_inicial: 'M', turma: '8º Ano A' },
  ano_letivo: '2026', media_geral: 8.4,
  materias: [
    { disciplina: 'Alemão', icone: 'language', media: 9.5, situacao: 'Excelente', bimestres: [{ bimestre: 1, valor: 9.0 }, { bimestre: 2, valor: 9.5 }, { bimestre: 3, valor: 10.0 }] },
    { disciplina: 'Ciências', icone: 'bulb', media: 8.8, situacao: 'Bom desempenho', bimestres: [{ bimestre: 1, valor: 8.5 }, { bimestre: 2, valor: 9.0 }, { bimestre: 3, valor: 9.0 }] },
    { disciplina: 'História SC', icone: 'book', media: 10.0, situacao: 'Excelente', bimestres: [{ bimestre: 1, valor: 10.0 }, { bimestre: 2, valor: 10.0 }] },
    { disciplina: 'Matemática', icone: 'grid', media: 8.0, situacao: 'Acima da média', bimestres: [{ bimestre: 1, valor: 7.5 }, { bimestre: 2, valor: 8.0 }, { bimestre: 3, valor: 8.5 }] },
  ],
};

function Boletim({ showToast }) {
  const [dados, setDados] = useState(API_ATIVA ? null : DEMO_BOLETIM);
  useEffect(() => { if (API_ATIVA) api.boletim().then(setDados).catch(() => setDados({ materias: [], media_geral: null })); }, []);

  if (!dados) return <p className="feed-end">Carregando boletim…</p>;
  const corNota = (v) => v >= 9 ? 'nota-otima' : v >= 7 ? 'nota-boa' : v >= 6 ? 'nota-media' : 'nota-baixa';

  return (
    <div className="pad">
      <h2 className="h2">Boletim</h2>
      <p className="sub">Ano letivo {dados.ano_letivo || new Date().getFullYear()}</p>

      {dados.media_geral != null && (
        <div className="boletim-geral fachwerk">
          <div><span>Média geral</span><strong>{dados.media_geral}</strong></div>
          <div className="boletim-geral-txt">
            <Icon name="trophy" size={26} />
            <p>{dados.media_geral >= 9 ? 'Excelente!' : dados.media_geral >= 7 ? 'Bom desempenho' : 'Continue se esforçando'}</p>
          </div>
        </div>
      )}

      {dados.materias.length === 0 && <p className="coments-empty">Nenhuma nota lançada ainda.</p>}
      {dados.materias.map((m) => (
        <div key={m.disciplina} className="materia">
          <Tile icon={m.icone || 'book'} tone="blue" size={42} radius={12} />
          <div className="materia-body">
            <strong>{m.disciplina}</strong>
            <span>{m.situacao}</span>
            <div className="materia-bims">
              {m.bimestres.map((b) => <span key={b.bimestre} className="bim">{b.bimestre}º <b>{b.valor.toFixed(1)}</b></span>)}
            </div>
          </div>
          <div className={`materia-media ${corNota(m.media)}`}>{m.media.toFixed(1)}</div>
        </div>
      ))}
    </div>
  );
}

/* ===================== WIDGETS DA COLUNA LATERAL ===================== */
const DEMO_AGENDA = [
  { id: 1, titulo: 'Prova de História Regional', tipo: 'prova', dia: 8, mes: 'set', disciplina: 'História SC' },
  { id: 2, titulo: 'Torneio Interescolar de Vôlei', tipo: 'evento', dia: 11, mes: 'set' },
  { id: 3, titulo: 'Entrega: maquete enxaimel', tipo: 'tarefa', dia: 14, mes: 'set', disciplina: 'Artes' },
];

function WidgetAgenda() {
  const [itens, setItens] = useState(API_ATIVA ? null : DEMO_AGENDA);
  useEffect(() => { if (API_ATIVA) api.agenda().then(setItens).catch(() => setItens([])); }, []);
  const cor = { prova: 'red', evento: 'gold', tarefa: 'blue' };
  return (
    <section className="widget">
      <h3 className="widget-titulo"><Icon name="book" size={16} /> Agenda</h3>
      {itens === null && <p className="widget-vazio">Carregando…</p>}
      {itens && itens.length === 0 && <p className="widget-vazio">Nada marcado por enquanto.</p>}
      {itens && itens.map((a) => (
        <div key={a.id} className="agenda-item">
          <div className={`agenda-data tone-${cor[a.tipo] || 'blue'}`}><strong>{a.dia}</strong><span>{a.mes}</span></div>
          <div className="agenda-txt"><strong>{a.titulo}</strong><span>{a.disciplina || a.tipo}</span></div>
        </div>
      ))}
    </section>
  );
}

function WidgetAvisos({ irParaAvisos }) {
  const [itens, setItens] = useState(API_ATIVA ? null : DEMO_AVISOS.slice(0, 2));
  useEffect(() => { if (API_ATIVA) api.avisos().then((l) => setItens(l.slice(0, 2))).catch(() => setItens([])); }, []);
  return (
    <section className="widget">
      <h3 className="widget-titulo"><Icon name="bell" size={16} /> Avisos</h3>
      {itens === null && <p className="widget-vazio">Carregando…</p>}
      {itens && itens.length === 0 && <p className="widget-vazio">Sem avisos novos.</p>}
      {itens && itens.map((a) => (
        <button key={a.id} className="widget-aviso" onClick={irParaAvisos}>
          <strong>{a.titulo}</strong>
          <span>{a.tempo}</span>
        </button>
      ))}
      <button className="btn btn-ghost btn-sm btn-block" style={{ marginTop: 8 }} onClick={irParaAvisos}>Ver todos</button>
    </section>
  );
}

function WidgetEscola({ usuario }) {
  return (
    <section className="widget widget-escola fachwerk">
      <h3 className="widget-titulo"><Icon name="school" size={16} /> Sua escola</h3>
      <p className="widget-escola-nome">Escola Doutor Blumenau</p>
      <p className="widget-escola-cidade">Pomerode, SC · Nossa Pequena Alemanha</p>
      <div className="widget-escola-stats">
        <div><strong>{usuario.pontos ?? 0}</strong><span>seus pontos</span></div>
        <div><strong>{usuario.turma || '—'}</strong><span>sua turma</span></div>
      </div>
    </section>
  );
}

/* ===================== CARTÃO DO ALUNO (header) ===================== */
function CartaoAluno({ usuario, aoTocar }) {
  return (
    <button className="cartao-aluno" onClick={aoTocar}>
      <Avatar initial={usuario.avatar_inicial} foto={usuario.foto_url} size={40} badgeIcon={usuario.status_icone} />
      <div>
        <strong>{usuario.apelido}</strong>
        <span>{usuario.turma || 'Aluno'} · Doutor Blumenau</span>
      </div>
    </button>
  );
}

/* ===================== FALACOMIGO — comunicação assistiva ===================== */
function FalaComigo({ usuario, showToast, voltar }) {
  const [cat, setCat] = useState('sos');
  const [ultimo, setUltimo] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [historico, setHistorico] = useState([]);

  useEffect(() => {
    if (API_ATIVA) api.falaMeus().then(setHistorico).catch(() => {});
    // "acorda" as vozes do aparelho (alguns navegadores só carregam depois)
    try { window.speechSynthesis?.getVoices(); } catch (e) { /* */ }
  }, []);

  const tocar = async (item) => {
    const urgente = !!item.sos;
    falar(item.f);
    setUltimo({ ...item, urgente });
    if (navigator.vibrate) navigator.vibrate(urgente ? [80, 50, 80] : 40);

    if (!API_ATIVA) { showToast(urgente ? 'Coordenação avisada! 🆘' : 'Pedido enviado'); return; }
    try {
      setEnviando(true);
      await api.falaPedido({ categoria: cat, item: item.id, rotulo: item.n, frase: item.f, urgente });
      setHistorico((h) => [{ id: Date.now(), rotulo: item.n, frase: item.f, urgente, tempo: 'agora' }, ...h]);
      showToast(urgente ? 'Coordenação avisada! 🆘' : 'Pedido enviado');
    } catch (e) { showToast(e.message); } finally { setEnviando(false); }
  };

  const itens = CARTOES[cat] || [];

  return (
    <div className="fala">
      <div className="fala-topo">
        <button className="voltar-link" onClick={voltar}><Icon name="arrowLeft" size={16} /> Voltar</button>
        <h2 className="h2">Fala Comigo</h2>
        <p className="sub">Toque no que você quer dizer. O app fala por você.</p>
      </div>

      {ultimo && (
        <div className={`fala-eco ${ultimo.urgente ? 'urgente' : ''}`}>
          <Icon name={ultimo.urgente ? 'flag' : 'chat'} size={20} />
          <p>{ultimo.f}</p>
          <button onClick={() => falar(ultimo.f)} aria-label="Repetir"><Icon name="refresh" size={18} /></button>
        </div>
      )}

      <div className="fala-cats">
        {CATEGORIAS.map((c) => (
          <button key={c.id} className={`fala-cat ${cat === c.id ? 'is-on' : ''} ${c.id === 'sos' ? 'sos' : ''}`} onClick={() => setCat(c.id)}>
            <span className="fala-cat-e">{c.e}</span>
            <span>{c.n}</span>
          </button>
        ))}
      </div>

      <div className="fala-grade">
        {itens.map((it) => (
          <button key={it.id} className={`fala-card ${it.sos ? 'sos' : ''}`} onClick={() => tocar(it)} disabled={enviando}>
            <span className="fala-card-n">{it.n}</span>
          </button>
        ))}
      </div>

      {historico.length > 0 && (
        <div className="fala-hist">
          <p className="label">O que você já disse hoje</p>
          {historico.slice(0, 6).map((h) => (
            <div key={h.id} className={`fala-hist-item ${h.urgente ? 'urgente' : ''}`}>
              <strong>{h.rotulo}</strong><span>{h.tempo}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---- Fila do professor: quem pediu ajuda ---- */
function FilaFala({ showToast }) {
  const [dados, setDados] = useState(API_ATIVA ? null : {
    abertos: [
      { id: 1, rotulo: 'SOCORRO', frase: 'Eu preciso de ajuda agora!', urgente: true, aluno: { apelido: 'Miguel', avatar_inicial: 'M', turma: '6º Ano A' }, tempo: '2 min' },
      { id: 2, rotulo: 'Muito barulho', frase: 'Está muito barulhento para mim', urgente: false, aluno: { apelido: 'Miguel', avatar_inicial: 'M', turma: '6º Ano A' }, tempo: '18 min' },
    ],
    atendidos: [{ id: 3, rotulo: 'Banheiro', frase: 'Eu preciso ir ao banheiro', urgente: false, aluno: { apelido: 'Miguel', avatar_inicial: 'M' }, tempo: '1 h', atendido: true, atendido_por: 'ProfAna' }],
  });

  const carregar = useCallback(async () => {
    if (!API_ATIVA) return;
    try { setDados(await api.falaFila()); } catch (e) { showToast(e.message); setDados({ abertos: [], atendidos: [] }); }
  }, [showToast]);

  useEffect(() => { carregar(); }, [carregar]);
  useEffect(() => {
    if (!API_ATIVA) return;
    const t = setInterval(carregar, 15000); // atualiza sozinho
    return () => clearInterval(t);
  }, [carregar]);

  const atender = async (id) => {
    setDados((d) => ({ ...d, abertos: d.abertos.filter((p) => p.id !== id) }));
    if (API_ATIVA) { try { await api.falaAtender(id); carregar(); } catch (e) { showToast(e.message); } }
    showToast('Marcado como atendido');
  };

  if (!dados) return <p className="feed-end">Carregando…</p>;

  return (
    <div className="pad">
      <h2 className="h2">Pedidos de ajuda</h2>
      <p className="sub">Alunos que usam a comunicação assistiva.</p>

      {dados.abertos.length === 0 && (
        <div className="mod-empty"><Icon name="check" size={22} stroke={2.5} /> Nenhum pedido aberto agora.</div>
      )}

      {dados.abertos.map((p) => (
        <div key={p.id} className={`fala-pedido ${p.urgente ? 'urgente' : ''}`}>
          <Avatar initial={p.aluno.avatar_inicial} foto={p.aluno.foto_url} size={44} />
          <div className="fala-pedido-body">
            <div className="fala-pedido-tags">
              {p.urgente && <span className="fala-tag-sos">🆘 Urgente</span>}
              <span className="fala-tag">{p.rotulo}</span>
            </div>
            <p className="fala-pedido-frase">"{p.frase}"</p>
            <span className="fala-pedido-meta">{p.aluno.apelido}{p.aluno.turma ? ` · ${p.aluno.turma}` : ''} · {p.tempo}</span>
          </div>
          <button className="btn btn-red btn-sm" onClick={() => atender(p.id)}><Icon name="check" size={15} stroke={3} /> Atendi</button>
        </div>
      ))}

      {dados.atendidos?.length > 0 && (<>
        <p className="label" style={{ marginTop: 22 }}>Já atendidos</p>
        {dados.atendidos.map((p) => (
          <div key={p.id} className="fala-pedido atendido">
            <Avatar initial={p.aluno.avatar_inicial} size={36} />
            <div className="fala-pedido-body">
              <p className="fala-pedido-frase">"{p.frase}"</p>
              <span className="fala-pedido-meta">{p.aluno.apelido} · {p.tempo} · atendido por {p.atendido_por}</span>
            </div>
            <Icon name="check" size={20} style={{ color: '#3B6D11' }} />
          </div>
        ))}
      </>)}
    </div>
  );
}

/* ===================== CENTRAL DA ESCOLA (alimentar dados) ===================== */
const DEMO_ALUNOS = [
  { id: 11, apelido: 'Marco', avatar_inicial: 'M', turma: '8º Ano A', papel: 'aluno', notas: 13, comunicacao_assistiva: true },
  { id: 12, apelido: 'Bel', avatar_inicial: 'B', turma: '8º Ano A', papel: 'aluno', notas: 13, comunicacao_assistiva: false },
  { id: 18, apelido: 'Larissa', avatar_inicial: 'L', turma: '8º Ano A', papel: 'aluno', notas: 13, comunicacao_assistiva: false },
  { id: 14, apelido: 'Théo', avatar_inicial: 'T', turma: '8º Ano A', papel: 'aluno', notas: 13, comunicacao_assistiva: false },
  { id: 13, apelido: 'Lucas', avatar_inicial: 'L', turma: '8º Ano B', papel: 'aluno', notas: 0, comunicacao_assistiva: false },
  { id: 16, apelido: 'Helena', avatar_inicial: 'H', turma: '8º Ano A', papel: 'aluno', notas: 0, comunicacao_assistiva: false },
];
const DISCIPLINAS_PADRAO = ['Alemão', 'Matemática', 'Português', 'História SC', 'Ciências', 'Geografia', 'Educação Física', 'Artes'];

function CentralEscola({ usuario, showToast }) {
  const [aba, setAba] = useState('notas');
  const abas = [
    ['notas', 'book', 'Notas'],
    ['agenda', 'star', 'Agenda'],
    ['alunos', 'users', 'Alunos'],
  ];
  return (
    <div className="pad">
      <h2 className="h2">Central da escola</h2>
      <p className="sub">Aqui você alimenta os dados do sistema.</p>
      <div className="central-abas">
        {abas.map(([id, ic, lb]) => (
          <button key={id} className={aba === id ? 'is-on' : ''} onClick={() => setAba(id)}>
            <Icon name={ic} size={16} /> {lb}
          </button>
        ))}
      </div>
      {aba === 'notas' && <LancarNotas showToast={showToast} />}
      {aba === 'agenda' && <CriarAgenda showToast={showToast} />}
      {aba === 'alunos' && <GerenciarAlunos showToast={showToast} />}
    </div>
  );
}

/* ---- Lançar notas ---- */
function LancarNotas({ showToast }) {
  const [alunos, setAlunos] = useState(API_ATIVA ? [] : DEMO_ALUNOS);
  const [disciplinas, setDisciplinas] = useState(DISCIPLINAS_PADRAO);
  const [alunoId, setAlunoId] = useState('');
  const [disciplina, setDisciplina] = useState('Matemática');
  const [bimestre, setBimestre] = useState(1);
  const [valor, setValor] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [ultimas, setUltimas] = useState([]);

  useEffect(() => {
    if (!API_ATIVA) { setAlunoId(DEMO_ALUNOS[0].id); return; }
    api.admin.alunos().then((l) => { const so = l.filter((u) => u.papel === 'aluno'); setAlunos(so); if (so[0]) setAlunoId(so[0].id); }).catch(() => {});
    api.admin.turmas().then((t) => { if (t.disciplinas?.length) setDisciplinas([...new Set([...t.disciplinas, ...DISCIPLINAS_PADRAO])]); }).catch(() => {});
  }, []);

  const salvar = async () => {
    const v = parseFloat(String(valor).replace(',', '.'));
    if (!alunoId) { showToast('Escolha o aluno'); return; }
    if (isNaN(v) || v < 0 || v > 10) { showToast('Nota deve ser entre 0 e 10'); return; }
    const aluno = alunos.find((a) => String(a.id) === String(alunoId));
    if (!API_ATIVA) {
      setUltimas((u) => [{ id: Date.now(), aluno: aluno?.apelido, disciplina, bimestre, valor: v }, ...u]);
      setValor(''); showToast(`Nota ${v} lançada para ${aluno?.apelido}`); return;
    }
    try {
      setSalvando(true);
      await api.lancarNota({ usuario_id: alunoId, disciplina, bimestre, valor: v });
      setUltimas((u) => [{ id: Date.now(), aluno: aluno?.apelido, disciplina, bimestre, valor: v }, ...u]);
      setValor(''); showToast(`Nota ${v} lançada para ${aluno?.apelido}`);
    } catch (e) { showToast(e.message); } finally { setSalvando(false); }
  };

  return (
    <div className="central-form">
      <p className="label">Lançar nota</p>

      <label className="campo-rot">Aluno</label>
      <select className="input" value={alunoId} onChange={(e) => setAlunoId(e.target.value)}>
        {alunos.length === 0 && <option>Nenhum aluno cadastrado</option>}
        {alunos.map((a) => <option key={a.id} value={a.id}>{a.apelido}{a.turma ? ` — ${a.turma}` : ''}</option>)}
      </select>

      <label className="campo-rot">Disciplina</label>
      <select className="input" value={disciplina} onChange={(e) => setDisciplina(e.target.value)}>
        {disciplinas.map((d) => <option key={d} value={d}>{d}</option>)}
      </select>

      <label className="campo-rot">Bimestre</label>
      <div className="bim-botoes">
        {[1, 2, 3, 4].map((b) => (
          <button key={b} className={`bim-btn ${bimestre === b ? 'is-on' : ''}`} onClick={() => setBimestre(b)}>{b}º</button>
        ))}
      </div>

      <label className="campo-rot">Nota (0 a 10)</label>
      <input className="input nota-input" value={valor} onChange={(e) => setValor(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && salvar()} placeholder="8.5" inputMode="decimal" />

      <button className="btn btn-red btn-block" style={{ marginTop: 14 }} onClick={salvar} disabled={salvando}>
        <Icon name="check" size={17} stroke={3} /> {salvando ? 'Salvando…' : 'Lançar nota'}
      </button>

      {ultimas.length > 0 && (
        <>
          <p className="label" style={{ marginTop: 20 }}>Lançadas agora</p>
          {ultimas.slice(0, 6).map((u) => (
            <div key={u.id} className="lancada">
              <strong>{u.aluno}</strong>
              <span>{u.disciplina} · {u.bimestre}º bim</span>
              <em>{u.valor.toFixed(1)}</em>
            </div>
          ))}
        </>
      )}
      <p className="central-dica">Lançar de novo a mesma disciplina e bimestre substitui a nota anterior.</p>
    </div>
  );
}

/* ---- Criar item de agenda ---- */
function CriarAgenda({ showToast }) {
  const [titulo, setTitulo] = useState('');
  const [tipo, setTipo] = useState('prova');
  const [data, setData] = useState('');
  const [turma, setTurma] = useState('');
  const [disciplina, setDisciplina] = useState('');
  const [descricao, setDescricao] = useState('');
  const [turmas, setTurmas] = useState([]);
  const [disciplinas, setDisciplinas] = useState(DISCIPLINAS_PADRAO);
  const [salvando, setSalvando] = useState(false);
  const [criados, setCriados] = useState([]);

  useEffect(() => {
    if (!API_ATIVA) { setTurmas(['8º Ano A', '8º Ano B']); return; }
    api.admin.turmas().then((t) => {
      setTurmas(t.turmas || []);
      if (t.disciplinas?.length) setDisciplinas([...new Set([...t.disciplinas, ...DISCIPLINAS_PADRAO])]);
    }).catch(() => {});
  }, []);

  const salvar = async () => {
    if (!titulo.trim()) { showToast('Escreva o título'); return; }
    if (!data) { showToast('Escolha a data'); return; }
    const dados = { titulo: titulo.trim(), tipo, data, turma_alvo: turma || null, disciplina: disciplina || null, descricao: descricao.trim() || null };
    if (!API_ATIVA) {
      setCriados((c) => [{ id: Date.now(), ...dados }, ...c]);
      setTitulo(''); setDescricao(''); showToast('Adicionado à agenda'); return;
    }
    try {
      setSalvando(true);
      await api.criarAgenda(dados);
      setCriados((c) => [{ id: Date.now(), ...dados }, ...c]);
      setTitulo(''); setDescricao(''); showToast('Adicionado à agenda');
    } catch (e) { showToast(e.message); } finally { setSalvando(false); }
  };

  const tipos = [['prova', 'book', 'Prova'], ['tarefa', 'grid', 'Tarefa'], ['evento', 'star', 'Evento']];

  return (
    <div className="central-form">
      <p className="label">Novo item na agenda</p>

      <label className="campo-rot">O que é</label>
      <div className="tipo-botoes">
        {tipos.map(([id, ic, lb]) => (
          <button key={id} className={`tipo-btn ${tipo === id ? 'is-on' : ''}`} onClick={() => setTipo(id)}>
            <Icon name={ic} size={16} /> {lb}
          </button>
        ))}
      </div>

      <label className="campo-rot">Título</label>
      <input className="input" value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Prova de História Regional" />

      <label className="campo-rot">Data</label>
      <input className="input" type="date" value={data} onChange={(e) => setData(e.target.value)} />

      <label className="campo-rot">Turma <span className="opcional">(vazio = todas)</span></label>
      <select className="input" value={turma} onChange={(e) => setTurma(e.target.value)}>
        <option value="">Todas as turmas</option>
        {turmas.map((t) => <option key={t} value={t}>{t}</option>)}
      </select>

      <label className="campo-rot">Disciplina <span className="opcional">(opcional)</span></label>
      <select className="input" value={disciplina} onChange={(e) => setDisciplina(e.target.value)}>
        <option value="">—</option>
        {disciplinas.map((d) => <option key={d} value={d}>{d}</option>)}
      </select>

      <label className="campo-rot">Detalhes <span className="opcional">(opcional)</span></label>
      <textarea className="composer-input" rows={2} value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Estudar capítulos 4 e 5" />

      <button className="btn btn-red btn-block" style={{ marginTop: 14 }} onClick={salvar} disabled={salvando}>
        <Icon name="plus" size={17} stroke={3} /> {salvando ? 'Salvando…' : 'Adicionar à agenda'}
      </button>

      {criados.length > 0 && (
        <>
          <p className="label" style={{ marginTop: 20 }}>Criados agora</p>
          {criados.map((c) => (
            <div key={c.id} className="lancada">
              <strong>{c.titulo}</strong>
              <span>{c.tipo} · {c.data}{c.turma_alvo ? ` · ${c.turma_alvo}` : ''}</span>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

/* ---- Gerenciar alunos ---- */
function GerenciarAlunos({ showToast }) {
  const [alunos, setAlunos] = useState(API_ATIVA ? null : DEMO_ALUNOS);
  const [editando, setEditando] = useState(null);
  const [turmaNova, setTurmaNova] = useState('');

  const carregar = useCallback(async () => {
    if (!API_ATIVA) return;
    try { setAlunos(await api.admin.alunos()); } catch (e) { showToast(e.message); setAlunos([]); }
  }, [showToast]);
  useEffect(() => { carregar(); }, [carregar]);

  const salvarTurma = async (a) => {
    const t = turmaNova.trim();
    setAlunos((l) => l.map((x) => x.id === a.id ? { ...x, turma: t } : x));
    setEditando(null);
    if (API_ATIVA) { try { await api.admin.salvarAluno(a.id, { turma: t }); } catch (e) { showToast(e.message); carregar(); return; } }
    showToast(`${a.apelido} → ${t || 'sem turma'}`);
  };

  const alternarFala = async (a) => {
    const novo = !a.comunicacao_assistiva;
    setAlunos((l) => l.map((x) => x.id === a.id ? { ...x, comunicacao_assistiva: novo } : x));
    if (API_ATIVA) { try { await api.admin.salvarAluno(a.id, { comunicacao_assistiva: novo }); } catch (e) { showToast(e.message); carregar(); return; } }
    showToast(novo ? `Fala Comigo ativado para ${a.apelido}` : `Desativado para ${a.apelido}`);
  };

  if (alunos === null) return <p className="feed-end">Carregando…</p>;

  return (
    <div>
      <p className="label">Alunos da escola ({alunos.length})</p>
      {alunos.map((a) => (
        <div key={a.id} className="aluno-linha">
          <Avatar initial={a.avatar_inicial} foto={a.foto_url} size={40} />
          <div className="aluno-info">
            <strong>{a.apelido}{a.papel !== 'aluno' && <span className="aluno-papel">{a.papel}</span>}</strong>
            {editando === a.id ? (
              <div className="aluno-edit">
                <input className="input" value={turmaNova} onChange={(e) => setTurmaNova(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && salvarTurma(a)} placeholder="8º Ano A" autoFocus />
                <button className="btn btn-red btn-sm" onClick={() => salvarTurma(a)}><Icon name="check" size={14} stroke={3} /></button>
              </div>
            ) : (
              <button className="aluno-turma" onClick={() => { setEditando(a.id); setTurmaNova(a.turma || ''); }}>
                {a.turma || 'sem turma'} <Icon name="bulb" size={12} />
              </button>
            )}
          </div>
          <div className="aluno-acoes">
            <span className="aluno-notas">{a.notas || 0} notas</span>
            <button className={`fala-toggle ${a.comunicacao_assistiva ? 'is-on' : ''}`} onClick={() => alternarFala(a)} title="Fala Comigo">
              <Icon name="chat" size={16} />
            </button>
          </div>
        </div>
      ))}
      <p className="central-dica">Toque na turma para editar. O ícone de balão liga o Fala Comigo para o aluno.</p>
    </div>
  );
}
