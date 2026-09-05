class Nota < ApplicationRecord
  self.table_name = "notas"
  belongs_to :usuario
  belongs_to :disciplina
  belongs_to :lancada_por, class_name: "Usuario", optional: true

  validates :valor, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 10 }
  validates :bimestre, inclusion: { in: 1..4 }
  validates :usuario_id, uniqueness: { scope: %i[disciplina_id bimestre ano_letivo] }

  before_validation { self.ano_letivo ||= Date.current.year.to_s }

  def situacao
    v = valor.to_f
    return "Excelente" if v >= 9
    return "Bom desempenho" if v >= 7
    return "Acima da média" if v >= 6
    "Precisa melhorar"
  end
end
