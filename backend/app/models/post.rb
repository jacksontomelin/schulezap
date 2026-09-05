class Post < ApplicationRecord
  self.table_name = "posts"
  belongs_to :usuario
  belongs_to :grupo
  belongs_to :ocultado_por, class_name: "Usuario", optional: true

  has_many :comentarios, class_name: "Comentario", dependent: :destroy
  has_many :reacoes, class_name: "Reacao", dependent: :destroy
  has_many :denuncias, class_name: "Denuncia", dependent: :destroy
  has_many :salvamentos, class_name: "Salvamento", dependent: :destroy
  has_many :mencoes, class_name: "Mencao", dependent: :destroy
  has_many :hashtags_posts, class_name: "HashtagPost", dependent: :destroy
  has_many :hashtags, through: :hashtags_posts, source: :hashtag
  has_one  :enquete, class_name: "Enquete", dependent: :destroy

  validates :texto, length: { maximum: 2000 }
  validate  :precisa_ter_conteudo

  scope :visiveis, -> { where(oculto: false) }
  scope :recentes, -> { order(created_at: :desc) }

  def precisa_ter_conteudo
    vazio = texto.blank? && imagem_url.blank? && lista_imagens.empty?
    errors.add(:base, "Escreva algo ou escolha uma foto") if vazio
  end

  # varias fotos: guarda JSON; sempre inclui a imagem_url legada
  def lista_imagens
    base = imagens.present? ? (JSON.parse(imagens) rescue []) : []
    base = [imagem_url] + base if imagem_url.present?
    base.compact.uniq
  end

  def lista_imagens=(arr)
    arr = Array(arr).compact.reject(&:blank?)
    self.imagem_url = arr.first
    self.imagens = arr.drop(1).to_json
  end

  def editado? = editado_em.present?

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
