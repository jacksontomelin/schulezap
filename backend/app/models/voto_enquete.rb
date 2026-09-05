class VotoEnquete < ApplicationRecord
  self.table_name = "votos_enquete"
  belongs_to :opcao, class_name: "OpcaoEnquete"
  belongs_to :usuario
  belongs_to :enquete
  validates :usuario_id, uniqueness: { scope: :enquete_id, message: "já votou nesta enquete" }
end
