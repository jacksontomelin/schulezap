class Amizade < ApplicationRecord
  belongs_to :seguidor, class_name: "Usuario"
  belongs_to :seguido, class_name: "Usuario"
  validates :seguidor_id, uniqueness: { scope: :seguido_id }
  validate  :nao_seguir_a_si_mesmo

  private
  def nao_seguir_a_si_mesmo
    errors.add(:base, "Não dá pra seguir a si mesmo") if seguidor_id == seguido_id
  end
end
