class VisualizacaoStory < ApplicationRecord
  self.table_name = "visualizacoes_story"

  belongs_to :story
  belongs_to :usuario

  validates :usuario_id, uniqueness: { scope: :story_id }
end
