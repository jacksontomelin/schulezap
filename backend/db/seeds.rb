puts "Semeando SchuleZap..."

escola = Escola.find_or_create_by!(slug: "doutor-blumenau") do |e|
  e.nome = "Escola Doutor Blumenau"
  e.cidade = "Pomerode"
  e.uf = "SC"
end

# Responsavel/admin
diretora = Usuario.find_or_create_by!(escola: escola, apelido: "DiretoraAna") do |u|
  u.nome_completo = "Ana (responsável)"
  u.papel = :responsavel
  u.senha = "admin123"
  u.status_icone = "shield"
end

# Alunos demo
marco = Usuario.find_or_create_by!(escola: escola, apelido: "Marco") do |u|
  u.papel = :aluno; u.senha = "123456"; u.status_icone = "gamepad"; u.avatar_cor = "#C62828"
end
bel = Usuario.find_or_create_by!(escola: escola, apelido: "Bel") do |u|
  u.papel = :aluno; u.senha = "123456"; u.status_icone = "ball"; u.avatar_cor = "#E89B00"
end
lucas = Usuario.find_or_create_by!(escola: escola, apelido: "Lucas") do |u|
  u.papel = :aluno; u.senha = "123456"; u.status_icone = "gamepad"; u.avatar_cor = "#2E86C1"
end

# Grupos
turma  = escola.grupos.find_or_create_by!(nome: "Turma 6ºB") { |g| g.icone = "school"; g.cor_tema = "red" }
futebol = escola.grupos.find_or_create_by!(nome: "Grupo do Futebol") { |g| g.icone = "ball"; g.cor_tema = "blue" }
alemao = escola.grupos.find_or_create_by!(nome: "Clube de Alemão") { |g| g.icone = "language"; g.cor_tema = "gold" }

[marco, bel, lucas, diretora].each { |u| MembroGrupo.find_or_create_by!(grupo: turma, usuario: u) }
MembroGrupo.find_or_create_by!(grupo: futebol, usuario: marco)
MembroGrupo.find_or_create_by!(grupo: alemao, usuario: marco)
MembroGrupo.find_or_create_by!(grupo: futebol, usuario: bel)

# Posts demo
unless futebol.posts.exists?
  p1 = futebol.posts.create!(usuario: bel, texto: "Quem acertar o placar do jogo de sábado leva a figurinha rara. Comenta aí.")
  p2 = turma.posts.create!(usuario: lucas, texto: "Servidor novo no ar. Quem tá dentro hoje depois da aula?")
  marco.reacoes.create!(post: p1)
  lucas.reacoes.create!(post: p1)
  p1.comentarios.create!(usuario: marco, texto: "2 a 1 pro nosso time!")
end

# Medalhas
Medalha.find_or_create_by!(usuario: bel, chave: "craque_semana") { |m| m.titulo = "Craque da semana"; m.icone = "medal" }
Medalha.find_or_create_by!(usuario: marco, chave: "primeiro_post") { |m| m.titulo = "Primeiro post"; m.icone = "star" }

# Convites disponiveis
3.times { escola.convites.find_or_create_by!(turma_sugerida: "6B") { |c| c.gerado_por = diretora } rescue nil }

# --- social: bios, seguir, conversa exemplo ---
marco.update(bio: "Curto games e futebol") if marco.bio.blank?
bel.update(bio: "Craque do futebol ⚽") if bel.bio.blank?
lucas.update(bio: "Servidor sempre on 🎮") if lucas.bio.blank?

Amizade.find_or_create_by!(seguidor: marco, seguido: bel)
Amizade.find_or_create_by!(seguidor: marco, seguido: lucas)
Amizade.find_or_create_by!(seguidor: bel, seguido: marco)

conversa = Conversa.entre(marco, bel)
if conversa.mensagens.empty?
  conversa.mensagens.create!(remetente: bel, texto: "Oi Marco! Viu o jogo de sábado?")
  conversa.mensagens.create!(remetente: marco, texto: "Vi sim! Que golaço no final")
  conversa.mensagens.create!(remetente: bel, texto: "Bora jogar hoje depois da aula?")
end

# --- stories de exemplo (somem em 24h) ---
if Story.ativos.empty?
  bel.stories.create!(texto: "Treino hoje às 18h! ⚽", cor_fundo: "#C62828")
  lucas.stories.create!(texto: "Servidor novo no ar 🎮", cor_fundo: "#5B8C2A")
end

puts "Pronto!"
puts "  Escola: #{escola.nome}"
puts "  Login aluno:  Marco / 123456"
puts "  Login admin:  DiretoraAna / admin123"
puts "  Convites: #{escola.convites.disponiveis.pluck(:codigo).join(', ')}"
