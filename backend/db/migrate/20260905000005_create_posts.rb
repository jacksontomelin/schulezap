class CreatePosts < ActiveRecord::Migration[7.1]
  def change
    create_table :posts do |t|
      t.references :usuario, null: false, foreign_key: true
      t.references :grupo, null: false, foreign_key: true

      t.text :texto, null: false

      # moderacao
      t.boolean :oculto, null: false, default: false
      t.references :ocultado_por, foreign_key: { to_table: :usuarios }

      # contadores desnormalizados (performance no feed)
      t.integer :reacoes_count, null: false, default: 0
      t.integer :comentarios_count, null: false, default: 0

      t.timestamps
    end

    add_index :posts, [:grupo_id, :created_at]

    create_table :comentarios do |t|
      t.references :post, null: false, foreign_key: true
      t.references :usuario, null: false, foreign_key: true
      t.text :texto, null: false
      t.boolean :oculto, null: false, default: false

      t.timestamps
    end

    add_index :comentarios, [:post_id, :created_at]

    create_table :reacoes do |t|
      t.references :post, null: false, foreign_key: true
      t.references :usuario, null: false, foreign_key: true
      t.string :tipo, null: false, default: "curtida" # curtida, risada, etc.

      t.timestamps
    end

    # um usuario reage uma vez por post
    add_index :reacoes, [:post_id, :usuario_id], unique: true
  end
end
