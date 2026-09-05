class MembroGrupo < ApplicationRecord
  belongs_to :grupo
  belongs_to :usuario

  enum :papel_no_grupo, { membro: 0, moderador: 1 }, default: :membro

  validates :usuario_id, uniqueness: { scope: :grupo_id }
end
