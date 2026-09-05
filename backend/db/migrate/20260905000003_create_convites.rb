class CreateConvites < ActiveRecord::Migration[7.1]
  def change
    create_table :convites do |t|
      t.references :escola, null: false, foreign_key: true
      t.references :gerado_por, foreign_key: { to_table: :usuarios }

      # o codigo que o aluno digita pra entrar (ex.: "6B-2026")
      t.string :codigo, null: false
      t.string :turma_sugerida

      # quem usou o convite (nil ate ser resgatado)
      t.references :usado_por, foreign_key: { to_table: :usuarios }
      t.datetime :usado_em

      t.datetime :expira_em

      t.timestamps
    end

    add_index :convites, :codigo, unique: true
  end
end
