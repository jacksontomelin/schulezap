class Denuncia < ApplicationRecord
  self.table_name = "denuncias"
  belongs_to :post
  belongs_to :denunciado_por, class_name: "Usuario"
  belongs_to :resolvida_por, class_name: "Usuario", optional: true

  enum :status, { aberta: 0, resolvida: 1, descartada: 2 }, default: :aberta

  scope :pendentes, -> { where(status: :aberta) }
end
