class Reacao < ApplicationRecord
  self.table_name = "reacoes"
  belongs_to :post, counter_cache: :reacoes_count
  belongs_to :usuario

  validates :usuario_id, uniqueness: { scope: :post_id }
end
