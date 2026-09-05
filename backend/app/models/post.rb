class Post < ApplicationRecord
  self.table_name = "posts"
  belongs_to :usuario
  belongs_to :grupo
  belongs_to :ocultado_por, class_name: "Usuario", optional: true

  has_many :comentarios, class_name: "Comentario", dependent: :destroy
  has_many :reacoes, class_name: "Reacao", dependent: :destroy
  has_many :denuncias, class_name: "Denuncia", dependent: :destroy
  has_many :salvamentos, class_name: "Salvamento", dependent: :destroy

  validates :texto, length: { maximum: 2000 }
  validate  :precisa_ter_conteudo

  scope :visiveis, -> { where(oculto: false) }
  scope :recentes, -> { order(created_at: :desc) }

  def precisa_ter_conteudo
    errors.add(:base, "Escreva algo ou escolha uma foto") if texto.blank? && imagem_url.blank?
  end

  def reagiu?(usuario)
    reacoes.exists?(usuario_id: usuario.id)
  end

  def minha_reacao(usuario)
    reacoes.find_by(usuario_id: usuario.id)&.tipo
  end

  # contagem por tipo: { "curtida" => 3, "amei" => 1 }
  def reacoes_por_tipo
    reacoes.group(:tipo).count
  end

  def ocultar!(moderador)
    update!(oculto: true, ocultado_por: moderador)
  end
end
