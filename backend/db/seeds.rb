# ============================================================
# SchuleZap — dados de exemplo
# Popula a rede com uma turma inteira: alunos, posts com fotos,
# comentarios, reacoes, conversas, stories, avisos, boletim,
# ranking e desafios. Idempotente: pode rodar varias vezes.
# ============================================================

def foto(nome)
  caminho = Rails.root.join("db/seed_fotos/#{nome}.txt")
  File.exist?(caminho) ? File.read(caminho).strip : nil
end

puts "Semeando SchuleZap..."

escola = Escola.find_or_create_by!(slug: "doutor-blumenau") do |e|
  e.nome = "Escola Doutor Blumenau"
  e.cidade = "Pomerode"
  e.uf = "SC"
end

# ---------------- PESSOAS ----------------
def cria_aluno(escola, apelido, turma, bio, icone, cor, pontos = 0, papel = :aluno)
  u = Usuario.find_or_initialize_by(escola: escola, apelido: apelido)
  if u.new_record?
    u.senha = "123456"
    u.papel = papel
    u.turma = turma
    u.bio = bio
    u.status_icone = icone
    u.avatar_cor = cor
    u.pontos = pontos
    u.save!
  end
  u
end

diretora = cria_aluno(escola, "DiretoraAna", nil, "Coordenação pedagógica", "shield", "#1B5E8E", 0, :responsavel)
diretora.update!(senha: "admin123") if diretora.papel == "responsavel"

marco   = cria_aluno(escola, "Marco",   "8º Ano A", "Curto games e futebol ⚽🎮", "gamepad", "#C62828", 180)
bel     = cria_aluno(escola, "Bel",     "8º Ano A", "Craque do futebol. Torcedora raiz.", "ball", "#E89B00", 240)
lucas   = cria_aluno(escola, "Lucas",   "8º Ano B", "Servidor sempre on 🎮", "gamepad", "#2E86C1", 210)
theo    = cria_aluno(escola, "Theo",    "8º Ano A", "Aprendendo alemão de verdade", "language", "#5B8C2A", 150)
helena  = cria_aluno(escola, "Helena",  "8º Ano A", "Desenho tudo que vejo 🎨", "palette", "#8E44AD", 195)
pedro   = cria_aluno(escola, "Pedro",   "8º Ano B", "Fominha de vôlei", "ball", "#00838F", 120)
julia   = cria_aluno(escola, "Julia",   "8º Ano A", "Leio um livro por semana 📚", "book", "#6A1B9A", 165)
gustavo = cria_aluno(escola, "Gustavo", "8º Ano B", "Skate e música", "rocket", "#EF6C00", 90)
larissa = cria_aluno(escola, "Larissa", "8º Ano A", "Melhor da turma em matemática", "star", "#C2185B", 225)
rafa    = cria_aluno(escola, "Rafa",    "8º Ano B", "Bateria na banda da escola", "flame", "#455A64", 75)

alunos = [marco, bel, lucas, theo, helena, pedro, julia, gustavo, larissa, rafa]

# ---------------- GRUPOS ----------------
def grupo(escola, nome, icone, cor)
  escola.grupos.find_or_create_by!(nome: nome) { |g| g.icone = icone; g.cor_tema = cor }
end

turma_a  = grupo(escola, "Turma 8º Ano A", "school", "red")
turma_b  = grupo(escola, "Turma 8º Ano B", "school", "blue")
futebol  = grupo(escola, "Grupo do Futebol", "ball", "blue")
games    = grupo(escola, "Cantinho dos Games", "gamepad", "green")
alemao   = grupo(escola, "Clube de Alemão", "language", "gold")
arte     = grupo(escola, "Desenho e Arte", "palette", "red")
livros   = grupo(escola, "Clube do Livro", "book", "blue")

def membro(grupo, usuario)
  MembroGrupo.find_or_create_by!(grupo: grupo, usuario: usuario)
end

[marco, bel, theo, helena, julia, larissa].each { |u| membro(turma_a, u) }
[lucas, pedro, gustavo, rafa].each { |u| membro(turma_b, u) }
membro(turma_a, diretora); membro(turma_b, diretora)
[marco, bel, pedro, lucas].each { |u| membro(futebol, u) }
[marco, lucas, gustavo, rafa].each { |u| membro(games, u) }
[theo, julia, bel].each { |u| membro(alemao, u) }
[helena, julia, larissa].each { |u| membro(arte, u) }
[julia, larissa, theo].each { |u| membro(livros, u) }

# ---------------- AMIZADES (seguir) ----------------
pares = [
  [marco, bel], [marco, lucas], [marco, theo], [marco, helena],
  [bel, marco], [bel, larissa], [bel, pedro],
  [lucas, marco], [lucas, gustavo], [lucas, rafa],
  [helena, julia], [helena, larissa], [julia, helena],
  [larissa, bel], [theo, julia], [pedro, bel], [gustavo, lucas], [rafa, lucas]
]
pares.each { |a, b| Amizade.find_or_create_by!(seguidor: a, seguido: b) rescue nil }

# ---------------- POSTS ----------------
def cria_post(grupo, autor, texto, imagem: nil, horas: 1)
  p = Post.find_by(usuario: autor, texto: texto)
  return p if p
  p = grupo.posts.new(usuario: autor, texto: texto)
  p.lista_imagens = [imagem].compact
  p.save!
  p.update_columns(created_at: horas.hours.ago, updated_at: horas.hours.ago)
  Hashtag.registrar!(texto, post: p)
  Mencao.registrar!(texto, autor: autor, post: p)
  p
end

posts = []
posts << (p1 = cria_post(futebol, bel,
  "Quem acertar o placar do jogo de sábado leva a figurinha rara! 🏆 Comenta aí o palpite #futebol #turma8a",
  imagem: foto("futebol"), horas: 2))

posts << (p2 = cria_post(games, lucas,
  "Servidor novo no ar! Quem tá dentro hoje depois da aula? #games",
  imagem: foto("games"), horas: 5))

posts << (p3 = cria_post(alemao, theo,
  "Descobri que \"Freunde\" significa amigos em alemão. Combina com a gente! 🇩🇪 #alemao",
  horas: 8))

posts << (p4 = cria_post(arte, helena,
  "Terminei o desenho da casa enxaimel pro trabalho de artes. O que acharam? 🎨 #enxaimel #arte",
  imagem: foto("enxaimel"), horas: 12))

posts << (p5 = cria_post(turma_a, larissa,
  "Gente, a prova de matemática caiu tudo que a prof passou na revisão. Vale revisar o caderno! #prova",
  horas: 20))

posts << (p6 = cria_post(turma_a, julia,
  "Alguém tem o livro de História que a prof pediu? Posso pegar emprestado 📚",
  horas: 26))

posts << (p7 = cria_post(turma_a, marco,
  "Foto da nossa turma no passeio de ontem! Foi muito bom 😄 #turma8a",
  imagem: foto("turma"), horas: 30))

posts << (p8 = cria_post(alemao, julia,
  "Guten Morgen! Hoje a aula foi sobre as casas enxaimel de Pomerode. Aprendi um monte 🇩🇪",
  imagem: foto("sala"), horas: 34))

posts << (p9 = cria_post(turma_a, bel,
  "As inscrições da Osterfest abriram! Quem vai fazer a oficina de pintar Ostereier? 🥚 #osterfest",
  imagem: foto("ovos"), horas: 40))

posts << (p10 = cria_post(turma_b, pedro,
  "O lanche novo da cantina tá muito bom, recomendo! 🥪 #cantina",
  imagem: foto("lanche"), horas: 46))

posts << (p11 = cria_post(arte, helena,
  "Desenho do dia: tema de hoje era \"a rua da sua casa\". Ficou assim 🎨 #desenhododia",
  imagem: foto("arte"), horas: 52))

posts << (p12 = cria_post(games, gustavo,
  "Alguém joga o campeonato de sábado? Preciso de mais um no time #games",
  horas: 60))

posts << (p13 = cria_post(turma_b, rafa,
  "Ensaio da banda hoje às 17h no auditório. Aparece quem quiser assistir! 🥁",
  horas: 70))

posts << (p14 = cria_post(livros, julia,
  "Terminei o livro que peguei na biblioteca. Recomendo demais pra quem gosta de mistério 📚 #livros",
  horas: 80))

# ---------------- REAÇÕES ----------------
def reagir(post, usuario, tipo)
  Reacao.find_or_create_by!(post: post, usuario: usuario) { |r| r.tipo = tipo } rescue nil
end

tipos = %w[curtida amei risada uau]
{
  p1 => [[marco,"amei"],[lucas,"curtida"],[theo,"curtida"],[helena,"amei"],[julia,"curtida"],[larissa,"uau"],[pedro,"amei"],[gustavo,"curtida"]],
  p2 => [[marco,"amei"],[gustavo,"amei"],[rafa,"curtida"],[bel,"curtida"]],
  p3 => [[julia,"amei"],[bel,"curtida"],[larissa,"uau"],[marco,"risada"]],
  p4 => [[julia,"amei"],[larissa,"amei"],[bel,"uau"],[marco,"uau"],[theo,"curtida"],[diretora,"amei"]],
  p5 => [[marco,"uau"],[julia,"curtida"],[theo,"curtida"],[bel,"amei"]],
  p6 => [[larissa,"curtida"],[theo,"curtida"]],
  p7 => [[bel,"amei"],[helena,"amei"],[julia,"amei"],[theo,"curtida"],[larissa,"curtida"],[lucas,"uau"]],
  p8 => [[theo,"amei"],[marco,"curtida"],[diretora,"amei"]],
  p9 => [[helena,"amei"],[julia,"uau"],[larissa,"curtida"],[marco,"curtida"]],
  p10 => [[lucas,"risada"],[gustavo,"amei"],[rafa,"curtida"]],
  p11 => [[julia,"amei"],[larissa,"uau"],[bel,"amei"]],
  p12 => [[lucas,"curtida"],[rafa,"amei"]],
  p13 => [[gustavo,"amei"],[lucas,"curtida"],[pedro,"curtida"]],
  p14 => [[larissa,"amei"],[helena,"curtida"],[theo,"curtida"]],
}.each { |post, lista| lista.each { |u, t| reagir(post, u, t) if post } }

# ---------------- COMENTÁRIOS ----------------
def comentar(post, autor, texto, respondendo: nil)
  return nil unless post
  c = Comentario.find_by(post: post, usuario: autor, texto: texto)
  return c if c
  c = post.comentarios.create!(usuario: autor, texto: texto, respondendo_id: respondendo&.id)
  Mencao.registrar!(texto, autor: autor, comentario: c)
  c
end

c1 = comentar(p1, marco, "2 a 1 pro nosso time! 🔥")
comentar(p1, lucas, "Vou de 3 a 0, esse ano a gente ganha")
comentar(p1, pedro, "Concordo com o @Marco, 2 a 1")
comentar(p1, bel, "Anotado! Sábado a gente vê quem acertou 😄", respondendo: c1)
comentar(p2, marco, "Tô dentro! Que horas?")
comentar(p2, gustavo, "Bora! Entro depois das 18h")
comentar(p3, julia, "Que legal! Minha palavra favorita é Schmetterling (borboleta)")
c2 = comentar(p4, julia, "Ficou lindo Helena! Parece de verdade 😍")
comentar(p4, larissa, "Caprichou demais nos detalhes da madeira")
comentar(p4, helena, "Obrigada gente! Demorei uns 3 dias 🎨", respondendo: c2)
comentar(p5, marco, "Valeu pelo aviso, vou revisar hoje")
comentar(p5, theo, "A questão 7 caiu igualzinha na revisão")
comentar(p6, larissa, "Eu tenho! Levo amanhã pra você")
comentar(p7, bel, "Que dia bom foi esse! 😄")
comentar(p7, helena, "Melhor passeio do ano")
comentar(p9, helena, "Eu vou! Já me inscrevi na oficina")
comentar(p10, lucas, "O da terça é o melhor")
comentar(p11, julia, "Cada dia você desenha melhor")
comentar(p13, gustavo, "Vou assistir!")
comentar(p14, larissa, "Qual o nome do livro?")

# ---------------- SALVAMENTOS ----------------
[[marco, p4], [marco, p9], [bel, p7], [julia, p11], [larissa, p5], [helena, p4]].each do |u, p|
  Salvamento.find_or_create_by!(usuario: u, post: p) if p
end

# ---------------- STORIES (24h) ----------------
if Story.ativos.empty?
  bel.stories.create!(texto: "Treino hoje às 18h! Bora ⚽", cor_fundo: "#C62828")
  bel.stories.create!(imagem_url: foto("futebol"), texto: "Campo pronto!")
  lucas.stories.create!(texto: "Servidor novo no ar 🎮", cor_fundo: "#5B8C2A")
  helena.stories.create!(imagem_url: foto("arte"), texto: "Desenho de hoje 🎨")
  theo.stories.create!(texto: "Guten Morgen, turma! 🇩🇪", cor_fundo: "#2E86C1")
  larissa.stories.create!(texto: "Prova de mat amanhã, bora estudar 📐", cor_fundo: "#8E44AD")
end

# ---------------- CONVERSAS ----------------
def conversa_com(a, b, mensagens)
  c = Conversa.entre(a, b)
  return c if c.mensagens.any?
  mensagens.each_with_index do |(quem, txt), i|
    m = c.mensagens.create!(remetente: quem, texto: txt)
    m.update_columns(created_at: (mensagens.size - i).hours.ago)
  end
  c
end

conversa_com(marco, bel, [
  [bel, "Oi Marco! Viu o jogo de sábado?"],
  [marco, "Vi sim! Que golaço no final 😱"],
  [bel, "Bora jogar hoje depois da aula?"],
  [marco, "Bora! Que horas?"],
  [bel, "18h no campo da escola"],
])
conversa_com(marco, lucas, [
  [lucas, "Servidor tá on"],
  [marco, "Já tô entrando"],
])
conversa_com(marco, theo, [
  [theo, "Marco, me ajuda no exercício de alemão?"],
  [marco, "Claro! Qual questão?"],
  [theo, "A 5, não entendi os artigos"],
])
conversa_com(bel, larissa, [
  [larissa, "Bel, você entendeu a matéria de hoje?"],
  [bel, "Mais ou menos, vamos estudar junto?"],
  [larissa, "Boa ideia! Amanhã no intervalo"],
])

# ---------------- AVISOS ----------------
def aviso(escola, autor, titulo, corpo, categoria, fixado: false, turma: nil, horas: 2)
  a = escola.avisos.find_by(titulo: titulo)
  return a if a
  a = escola.avisos.create!(autor: autor, titulo: titulo, corpo: corpo,
                            categoria: categoria, fixado: fixado, turma_alvo: turma)
  a.update_columns(created_at: horas.hours.ago)
  a
end

aviso(escola, diretora, "Reunião de Pais e Alunos — 3º Trimestre",
  "Convocamos os responsáveis pelos alunos do Ensino Fundamental II para o encontro no auditório na próxima quinta-feira às 19h. Contamos com a presença de todos.",
  "reuniao", fixado: true, horas: 3)
aviso(escola, diretora, "Preparativos para a Osterfest Escolar 2026",
  "Lembramos todas as turmas do 6º ao 9º ano que as inscrições para as oficinas de pintura de casquinhas (Ostereier) encerram nesta sexta-feira!",
  "evento", horas: 26)
aviso(escola, diretora, "Rota do Enxaimel — Ciclismo Escolar",
  "Garanta sua camiseta oficial do evento no departamento de Educação Física até o dia 20.",
  "esporte", horas: 50)
aviso(escola, diretora, "Prova de História Regional — 8º Ano A",
  "A avaliação sobre a colonização alemã em Santa Catarina será na próxima terça-feira. Estudem os capítulos 4 e 5.",
  "prova", turma: "8º Ano A", horas: 8)
aviso(escola, diretora, "Biblioteca com novo horário",
  "A partir desta semana a biblioteca também abre no contraturno, das 13h30 às 17h.",
  "geral", horas: 72)

# ---------------- BOLETIM ----------------
materias = {
  "Alemão"      => ["language", { marco: [9.0, 9.5, 10.0], bel: [8.0, 8.5, 9.0], larissa: [9.5, 9.5, 10.0], theo: [10.0, 9.5, 9.5] }],
  "Matemática"  => ["grid",     { marco: [7.5, 8.0, 8.5], bel: [7.0, 7.5, 8.0], larissa: [10.0, 9.5, 10.0], theo: [7.0, 7.5, 7.0] }],
  "História SC" => ["book",     { marco: [10.0, 9.5], bel: [9.0, 9.5], larissa: [9.5, 10.0], theo: [8.5, 9.0] }],
  "Ciências"    => ["bulb",     { marco: [8.5, 9.0, 9.0], bel: [8.0, 8.0, 8.5], larissa: [9.0, 9.5, 9.0], theo: [8.0, 8.5, 8.0] }],
  "Educação Física" => ["ball", { marco: [9.5, 10.0], bel: [10.0, 10.0], larissa: [8.5, 9.0], theo: [9.0, 8.5] }],
}
mapa = { marco: marco, bel: bel, larissa: larissa, theo: theo }
materias.each do |nome, (icone, notas_por_aluno)|
  d = escola.disciplinas.find_or_create_by!(nome: nome) { |x| x.icone = icone }
  notas_por_aluno.each do |chave, valores|
    aluno = mapa[chave]
    valores.each_with_index do |v, i|
      Nota.find_or_create_by!(usuario: aluno, disciplina: d, bimestre: i + 1, ano_letivo: Date.current.year.to_s) do |n|
        n.valor = v
        n.lancada_por = diretora
      end
    end
  end
end

# ---------------- AGENDA ----------------
[
  ["Prova de História Regional", "prova",  3,  "8º Ano A", "História SC"],
  ["Torneio Interescolar de Vôlei", "evento", 6, nil, nil],
  ["Entrega: maquete enxaimel", "tarefa", 9,  "8º Ano A", "Artes"],
  ["Prova de Matemática", "prova", 12, nil, "Matemática"],
  ["Osterfest Escolar", "evento", 18, nil, nil],
].each do |titulo, tipo, dias, turma, disc|
  next if escola.agendas.exists?(titulo: titulo)
  d = disc ? escola.disciplinas.find_or_create_by!(nome: disc) : nil
  escola.agendas.create!(titulo: titulo, tipo: tipo, data: Date.current + dias, turma_alvo: turma, disciplina: d)
end

# ---------------- DESAFIOS E MEDALHAS ----------------
[[bel, "quiz", 4, 4], [larissa, "quiz", 4, 4], [lucas, "quiz", 3, 4],
 [marco, "palavra", 3, 3], [helena, "palavra", 2, 3], [julia, "quiz", 4, 4]].each do |u, desafio, acertos, total|
  next if ResultadoDesafio.exists?(usuario: u, desafio: desafio, dia: Date.current - 1)
  ResultadoDesafio.create!(usuario: u, desafio: desafio, acertos: acertos, total: total,
                           pontos_ganhos: acertos * 10 + (acertos == total ? 20 : 0), dia: Date.current - 1)
end

[[bel, "craque_semana", "Craque da semana", "medal"],
 [marco, "primeiro_post", "Primeiro post", "star"],
 [larissa, "quiz_perfeito", "Quiz perfeito", "trophy"],
 [helena, "primeiro_desafio", "Primeiro desafio", "sparkles"],
 [lucas, "sete_desafios", "7 desafios", "flame"],
 [julia, "quiz_perfeito", "Quiz perfeito", "trophy"]].each do |u, chave, titulo, icone|
  Medalha.find_or_create_by!(usuario: u, chave: chave) { |m| m.titulo = titulo; m.icone = icone }
end

# ---------------- CONVITES ----------------
if escola.convites.disponiveis.count < 3
  3.times { escola.convites.create!(turma_sugerida: "8A", gerado_por: diretora) }
end

puts "Pronto!"
puts "  Escola: #{escola.nome}"
puts "  Alunos: #{escola.usuarios.aluno.count} | Grupos: #{escola.grupos.count}"
puts "  Posts: #{Post.count} | Comentários: #{Comentario.count} | Reações: #{Reacao.count}"
puts "  Stories ativos: #{Story.ativos.count} | Conversas: #{Conversa.count} | Mensagens: #{Mensagem.count}"
puts "  Avisos: #{escola.avisos.count} | Notas: #{Nota.count} | Agenda: #{escola.agendas.count}"
puts ""
puts "  Login aluno: Marco / 123456   (ou Bel, Lucas, Theo, Helena, Julia, Larissa...)"
puts "  Login admin: DiretoraAna / admin123"
puts "  Convites: #{escola.convites.disponiveis.limit(3).pluck(:codigo).join(', ')}"
