class PedidoFala < ApplicationRecord
  self.table_name = "pedidos_fala"

  belongs_to :usuario
  belongs_to :escola
  belongs_to :atendido_por, class_name: "Usuario", optional: true

  validates :categoria, :item, :rotulo, :frase, presence: true

  scope :abertos, -> { where(atendido_em: nil) }
  scope :recentes, -> { order(urgente: :desc, created_at: :desc) }
  scope :de_hoje, -> { where("created_at >= ?", Time.current.beginning_of_day) }

  def atender!(quem)
    update!(atendido_por: quem, atendido_em: Time.current)
  end

  def atendido? = atendido_em.present?
end
