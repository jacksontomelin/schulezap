class Escola < ApplicationRecord
  has_many :usuarios, dependent: :destroy
  has_many :grupos, dependent: :destroy
  has_many :convites, dependent: :destroy

  validates :nome, presence: true
  validates :slug, presence: true, uniqueness: true

  before_validation :gerar_slug, on: :create

  private

  def gerar_slug
    self.slug ||= nome.to_s.parameterize
  end
end
