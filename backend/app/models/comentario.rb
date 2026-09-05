class Comentario < ApplicationRecord
  self.table_name = "comentarios"
  belongs_to :post, counter_cache: :comentarios_count
  belongs_to :usuario

  validates :texto, presence: true, length: { maximum: 1000 }

  scope :visiveis, -> { where(oculto: false) }
end
