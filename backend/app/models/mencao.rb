class Mencao < ApplicationRecord
  self.table_name = "mencoes"
  belongs_to :usuario
  belongs_to :autor, class_name: "Usuario"
  belongs_to :post, optional: true
  belongs_to :comentario, optional: true

  # extrai @apelidos de um texto e cria as mencoes
  def self.registrar!(texto, autor:, post: nil, comentario: nil)
    return [] if texto.blank?
    apelidos = texto.scan(/@([A-Za-zÀ-ÿ0-9_]{2,20})/).flatten.uniq
    return [] if apelidos.empty?
    alvos = autor.escola.usuarios.where("lower(apelido) IN (?)", apelidos.map(&:downcase))
    alvos.map do |u|
      next if u.id == autor.id
      create!(usuario: u, autor: autor, post: post, comentario: comentario)
    end.compact
  end
end
