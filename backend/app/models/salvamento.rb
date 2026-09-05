class Salvamento < ApplicationRecord
  belongs_to :usuario
  belongs_to :post
  validates :usuario_id, uniqueness: { scope: :post_id }
end
