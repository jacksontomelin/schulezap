class Usuario < ApplicationRecord
  self.table_name = "usuarios"
  # usa bcrypt via 'senha_digest' (has_secure_password aponta pro atributo custom)
  has_secure_password :senha, validations: true

  belongs_to :escola

  has_many :membros_grupo, class_name: "MembroGrupo", dependent: :destroy
  has_many :grupos, through: :membros_grupo, source: :grupo
  has_many :posts, dependent: :destroy
  has_many :comentarios, class_name: "Comentario", dependent: :destroy
  has_many :reacoes, class_name: "Reacao", dependent: :destroy
  has_many :medalhas, class_name: "Medalha", dependent: :destroy
  has_many :resultados_desafio, class_name: "ResultadoDesafio", dependent: :destroy
  has_many :salvamentos, class_name: "Salvamento", dependent: :destroy
  has_many :stories, class_name: "Story", dependent: :destroy
  has_many :mencoes, class_name: "Mencao", dependent: :destroy
  has_many :notas, class_name: "Nota", dependent: :destroy
  has_many :pedidos_fala, class_name: "PedidoFala", dependent: :destroy
  has_many :posts_salvos, through: :salvamentos, source: :post

  # amizades (seguir)
  has_many :relacoes_seguindo, class_name: "Amizade", foreign_key: :seguidor_id, dependent: :destroy
  has_many :seguindo, through: :relacoes_seguindo, source: :seguido
  has_many :relacoes_seguidores, class_name: "Amizade", foreign_key: :seguido_id, dependent: :destroy
  has_many :seguidores, through: :relacoes_seguidores, source: :seguidor

  enum :papel, { aluno: 0, responsavel: 1, admin: 2 }, default: :aluno

  validates :apelido, presence: true,
                      uniqueness: { scope: :escola_id, case_sensitive: false },
                      length: { minimum: 2, maximum: 20 }
  validates :email, uniqueness: true, allow_nil: true,
                    format: { with: URI::MailTo::EMAIL_REGEXP }, allow_blank: true

  before_validation :definir_inicial_avatar

  def moderador?
    responsavel? || admin?
  end

  def segue?(outro)
    seguindo.exists?(outro.id)
  end

  # soma pontos de forma atomica (sem race condition)
  def pontuar!(qtd)
    self.class.where(id: id).update_all(["pontos = pontos + ?", qtd])
    reload
  end

  # concede medalha se ainda nao tem; retorna a medalha nova ou nil
  def conceder_medalha!(chave, titulo, icone = "medal")
    return nil if medalhas.exists?(chave: chave)
    medalhas.create!(chave: chave, titulo: titulo, icone: icone)
  end

  # aluno so precisa de senha se tiver email; senha do convite pode ser simples.
  def as_json_publico
    {
      id: id,
      apelido: apelido,
      papel: papel,
      avatar_inicial: avatar_inicial,
      avatar_cor: avatar_cor,
      status_icone: status_icone,
      pontos: respond_to?(:pontos) ? pontos : 0,
      bio: respond_to?(:bio) ? bio : nil,
      foto_url: respond_to?(:foto_url) ? foto_url : nil,
      turma: respond_to?(:turma) ? turma : nil,
      comunicacao_assistiva: respond_to?(:comunicacao_assistiva) ? comunicacao_assistiva : false
    }
  end

  private

  def definir_inicial_avatar
    self.avatar_inicial ||= apelido.to_s.first&.upcase
  end
end
