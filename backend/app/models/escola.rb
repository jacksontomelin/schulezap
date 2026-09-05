class Escola < ApplicationRecord
  self.table_name = "escolas"
  has_many :usuarios, dependent: :destroy
  has_many :grupos, dependent: :destroy
  has_many :convites, dependent: :destroy
  has_many :avisos, class_name: "Aviso", dependent: :destroy
  has_many :disciplinas, class_name: "Disciplina", dependent: :destroy
  has_many :agendas, class_name: "Agenda", dependent: :destroy

  validates :nome, presence: true
  validates :slug, presence: true, uniqueness: true

  before_validation :gerar_slug, on: :create

  private

  def gerar_slug
    self.slug ||= nome.to_s.parameterize
  end
end
