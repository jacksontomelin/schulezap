class Medalha < ApplicationRecord
  belongs_to :usuario

  validates :chave, presence: true,
                    uniqueness: { scope: :usuario_id }

  before_validation { self.conquistada_em ||= Time.current }
end
