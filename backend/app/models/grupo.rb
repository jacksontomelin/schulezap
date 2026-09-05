class Grupo < ApplicationRecord
  belongs_to :escola
  belongs_to :criado_por, class_name: "Usuario", optional: true

  has_many :membros_grupo, dependent: :destroy
  has_many :usuarios, through: :membros_grupo
  has_many :posts, dependent: :destroy

  validates :nome, presence: true,
                   uniqueness: { scope: :escola_id, case_sensitive: false }

  def membro?(usuario)
    membros_grupo.exists?(usuario_id: usuario.id)
  end
end
