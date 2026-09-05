class ResultadoDesafio < ApplicationRecord
  self.table_name = "resultados_desafio"

  belongs_to :usuario

  DESAFIOS = %w[quiz palavra placar].freeze

  validates :desafio, inclusion: { in: DESAFIOS }
  validates :dia, presence: true
  validates :usuario_id, uniqueness: { scope: %i[desafio dia], message: "já jogou este desafio hoje" }

  before_validation { self.dia ||= Date.current }
end
