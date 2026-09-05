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

  # aluno so precisa de senha se tiver email; senha do convite pode ser simples.
  def as_json_publico
    {
      id: id,
      apelido: apelido,
      papel: papel,
      avatar_inicial: avatar_inicial,
      avatar_cor: avatar_cor,
      status_icone: status_icone
    }
  end

  private

  def definir_inicial_avatar
    self.avatar_inicial ||= apelido.to_s.first&.upcase
  end
end
