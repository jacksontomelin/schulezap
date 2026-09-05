class Agenda < ApplicationRecord
  self.table_name = "agendas"
  belongs_to :escola
  belongs_to :disciplina, optional: true

  TIPOS = %w[tarefa prova evento].freeze
  validates :titulo, :data, presence: true
  validates :tipo, inclusion: { in: TIPOS }

  scope :proximas, -> { where("data >= ?", Date.current).order(:data) }
  scope :para, ->(u) { where("turma_alvo IS NULL OR turma_alvo = ?", u.turma) }
end
