class AddPontosEDesafios < ActiveRecord::Migration[7.1]
  def change
    # pontuacao acumulada (ranking da turma)
    add_column :usuarios, :pontos, :integer, null: false, default: 0
    add_index  :usuarios, [:escola_id, :pontos]

    # historico de desafios jogados (1 por dia por desafio, evita farm)
    create_table :resultados_desafio do |t|
      t.references :usuario, null: false, foreign_key: true
      t.string  :desafio, null: false        # quiz, palavra, placar
      t.integer :acertos, null: false, default: 0
      t.integer :total,   null: false, default: 0
      t.integer :pontos_ganhos, null: false, default: 0
      t.date    :dia, null: false

      t.timestamps
    end

    add_index :resultados_desafio, [:usuario_id, :desafio, :dia], unique: true
  end
end
