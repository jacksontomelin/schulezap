class LeituraAviso < ApplicationRecord
  self.table_name = "leituras_aviso"
  belongs_to :aviso
  belongs_to :usuario
  validates :usuario_id, uniqueness: { scope: :aviso_id }
end
