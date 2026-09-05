class Mensagem < ApplicationRecord
  self.table_name = "mensagens"
  belongs_to :conversa
  belongs_to :remetente, class_name: "Usuario"

  validates :texto, length: { maximum: 2000 }
  validate  :precisa_conteudo

  def precisa_conteudo
    errors.add(:base, "Escreva algo ou envie uma foto") if texto.blank? && imagem_url.blank?
  end

  after_create_commit :tocar_conversa

  private

  def tocar_conversa
    conversa.update_column(:ultima_mensagem_em, created_at)
  end
end
