class OpcaoEnquete < ApplicationRecord
  self.table_name = "opcoes_enquete"
  belongs_to :enquete
  has_many :votos, class_name: "VotoEnquete", foreign_key: :opcao_id, dependent: :destroy
  validates :texto, presence: true
end
