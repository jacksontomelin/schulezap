class CreateMedalhasEDenuncias < ActiveRecord::Migration[7.1]
  def change
    create_table :medalhas do |t|
      t.references :usuario, null: false, foreign_key: true
      t.string :chave, null: false        # ex.: "craque_semana", "quiz_perfeito"
      t.string :titulo, null: false
      t.string :icone, default: "medal"
      t.datetime :conquistada_em, null: false

      t.timestamps
    end

    add_index :medalhas, [:usuario_id, :chave], unique: true

    # botao de denuncia em cada post (moderacao pelo responsavel)
    create_table :denuncias do |t|
      t.references :post, null: false, foreign_key: true
      t.references :denunciado_por, null: false, foreign_key: { to_table: :usuarios }
      t.string :motivo
      # status: 0 = aberta, 1 = resolvida, 2 = descartada
      t.integer :status, null: false, default: 0
      t.references :resolvida_por, foreign_key: { to_table: :usuarios }

      t.timestamps
    end

    add_index :denuncias, :status
  end
end
