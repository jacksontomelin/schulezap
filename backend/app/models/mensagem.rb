class Mensagem < ApplicationRecord
  self.table_name = "mensagens"
  belongs_to :conversa
  belongs_to :remetente, class_name: "Usuario"

  validates :texto, presence: true, length: { maximum: 2000 }

  after_create_commit :tocar_conversa

  private

  def tocar_conversa
    conversa.update_column(:ultima_mensagem_em, created_at)
  end
end
