class Disciplina < ApplicationRecord
  self.table_name = "disciplinas"
  belongs_to :escola
  has_many :notas, class_name: "Nota", foreign_key: :disciplina_id, dependent: :destroy
  validates :nome, presence: true, uniqueness: { scope: :escola_id }
end
