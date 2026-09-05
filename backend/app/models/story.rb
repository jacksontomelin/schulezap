class Story < ApplicationRecord
  self.table_name = "stories"

  belongs_to :usuario
  has_many :visualizacoes, class_name: "VisualizacaoStory", foreign_key: :story_id, dependent: :destroy

  validate :precisa_ter_conteudo
  before_validation { self.expira_em ||= 24.hours.from_now }

  scope :ativos, -> { where("expira_em > ?", Time.current).order(created_at: :asc) }

  def visto_por?(u)
    visualizacoes.exists?(usuario_id: u.id)
  end

  def marcar_visto!(u)
    VisualizacaoStory.find_or_create_by!(story: self, usuario: u)
  end

  private

  def precisa_ter_conteudo
    errors.add(:base, "Story precisa de foto ou texto") if imagem_url.blank? && texto.blank?
  end
end
