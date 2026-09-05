class Post < ApplicationRecord
  belongs_to :usuario
  belongs_to :grupo
  belongs_to :ocultado_por, class_name: "Usuario", optional: true

  has_many :comentarios, dependent: :destroy
  has_many :reacoes, dependent: :destroy
  has_many :denuncias, dependent: :destroy

  validates :texto, presence: true, length: { maximum: 2000 }

  scope :visiveis, -> { where(oculto: false) }
  scope :recentes, -> { order(created_at: :desc) }

  def reagiu?(usuario)
    reacoes.exists?(usuario_id: usuario.id)
  end

  def ocultar!(moderador)
    update!(oculto: true, ocultado_por: moderador)
  end
end
