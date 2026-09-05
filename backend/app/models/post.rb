class Post < ApplicationRecord
  self.table_name = "posts"
  belongs_to :usuario
  belongs_to :grupo
  belongs_to :ocultado_por, class_name: "Usuario", optional: true

  has_many :comentarios, class_name: "Comentario", dependent: :destroy
  has_many :reacoes, class_name: "Reacao", dependent: :destroy
  has_many :denuncias, class_name: "Denuncia", dependent: :destroy

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
