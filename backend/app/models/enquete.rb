class Enquete < ApplicationRecord
  self.table_name = "enquetes"
  belongs_to :post
  has_many :opcoes, class_name: "OpcaoEnquete", foreign_key: :enquete_id, dependent: :destroy
  has_many :votos, class_name: "VotoEnquete", foreign_key: :enquete_id, dependent: :destroy

  validates :pergunta, presence: true

  def total_votos = votos.count
  def votou?(u) = votos.exists?(usuario_id: u.id)
  def voto_de(u) = votos.find_by(usuario_id: u.id)&.opcao_id
end
