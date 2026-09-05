class Conversa < ApplicationRecord
  self.table_name = "conversas"
  belongs_to :usuario_a, class_name: "Usuario"
  belongs_to :usuario_b, class_name: "Usuario"
  has_many :mensagens, class_name: "Mensagem", foreign_key: :conversa_id, dependent: :destroy

  # sempre guarda o par ordenado (menor id em A) -> nunca duplica conversa
  def self.entre(u1, u2)
    a, b = [u1, u2].sort_by(&:id)
    find_or_create_by!(usuario_a: a, usuario_b: b)
  end

  def outro(usuario)
    usuario_a_id == usuario.id ? usuario_b : usuario_a
  end

  def participa?(usuario)
    [usuario_a_id, usuario_b_id].include?(usuario.id)
  end

  def nao_lidas_para(usuario)
    mensagens.where.not(remetente_id: usuario.id).where(lida_em: nil).count
  end
end
