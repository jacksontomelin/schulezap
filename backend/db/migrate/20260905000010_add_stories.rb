class AddStories < ActiveRecord::Migration[7.1]
  def change
    create_table :stories do |t|
      t.references :usuario, null: false, foreign_key: true
      t.text   :imagem_url            # foto (base64/URL)
      t.string :texto, limit: 120     # legenda ou story só de texto
      t.string :cor_fundo, default: "#F7B500"
      t.datetime :expira_em, null: false
      t.timestamps
    end
    add_index :stories, [:usuario_id, :expira_em]

    # quem já viu qual story
    create_table :visualizacoes_story do |t|
      t.references :story, null: false, foreign_key: true
      t.references :usuario, null: false, foreign_key: true
      t.timestamps
    end
    add_index :visualizacoes_story, [:story_id, :usuario_id], unique: true
  end
end
