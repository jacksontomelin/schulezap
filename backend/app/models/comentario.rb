class Comentario < ApplicationRecord
  self.table_name = "comentarios"
  belongs_to :post, counter_cache: :comentarios_count
  belongs_to :usuario
  belongs_to :respondendo, class_name: "Comentario", optional: true
  has_many :respostas, class_name: "Comentario", foreign_key: :respondendo_id, dependent: :destroy

  validates :texto, presence: true, length: { maximum: 1000 }

  scope :visiveis, -> { where(oculto: false) }
end
