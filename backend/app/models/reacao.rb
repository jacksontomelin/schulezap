class Reacao < ApplicationRecord
  self.table_name = "reacoes"
  belongs_to :post, counter_cache: :reacoes_count
  belongs_to :usuario

  TIPOS = %w[curtida amei risada uau triste].freeze
  validates :tipo, inclusion: { in: TIPOS }
  validates :usuario_id, uniqueness: { scope: :post_id }
end
