class Aviso < ApplicationRecord
  self.table_name = "avisos"
  belongs_to :escola
  belongs_to :autor, class_name: "Usuario"
  has_many :leituras, class_name: "LeituraAviso", foreign_key: :aviso_id, dependent: :destroy

  CATEGORIAS = %w[geral evento reuniao esporte prova].freeze

  validates :titulo, :corpo, presence: true
  validates :categoria, inclusion: { in: CATEGORIAS }

  scope :recentes, -> { order(fixado: :desc, created_at: :desc) }
  scope :para, ->(u) { where("turma_alvo IS NULL OR turma_alvo = ?", u.turma) }

  def lido_por?(u) = leituras.exists?(usuario_id: u.id)
  def marcar_lido!(u) = LeituraAviso.find_or_create_by!(aviso: self, usuario: u)
end
