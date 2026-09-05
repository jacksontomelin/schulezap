class AddSocialCompleto < ActiveRecord::Migration[7.1]
  def change
    # FOTO DE PERFIL e CAPA (base64/URL)
    add_column :usuarios, :foto_url, :text
    add_column :usuarios, :capa_url, :text

    # MULTIPLAS FOTOS por post (array de urls) + edicao
    add_column :posts, :imagens, :text          # JSON array
    add_column :posts, :editado_em, :datetime

    # ENQUETES
    create_table :enquetes do |t|
      t.references :post, null: false, foreign_key: true
      t.string :pergunta, null: false
      t.timestamps
    end
    create_table :opcoes_enquete do |t|
      t.references :enquete, null: false, foreign_key: true
      t.string :texto, null: false
      t.integer :ordem, null: false, default: 0
      t.timestamps
    end
    create_table :votos_enquete do |t|
      t.references :opcao, null: false, foreign_key: { to_table: :opcoes_enquete }
      t.references :usuario, null: false, foreign_key: true
      t.references :enquete, null: false, foreign_key: true
      t.timestamps
    end
    add_index :votos_enquete, [:enquete_id, :usuario_id], unique: true

    # FOTO no chat
    add_column :mensagens, :imagem_url, :text

    # MENCOES (@apelido) em posts e comentarios
    create_table :mencoes do |t|
      t.references :usuario, null: false, foreign_key: true       # quem foi mencionado
      t.references :autor, null: false, foreign_key: { to_table: :usuarios }
      t.references :post, foreign_key: true
      t.references :comentario, foreign_key: true
      t.timestamps
    end
    add_index :mencoes, [:usuario_id, :created_at]

    # HASHTAGS
    create_table :hashtags do |t|
      t.string :nome, null: false
      t.integer :usos, null: false, default: 0
      t.timestamps
    end
    add_index :hashtags, :nome, unique: true
    create_table :hashtags_posts do |t|
      t.references :hashtag, null: false, foreign_key: true
      t.references :post, null: false, foreign_key: true
    end
    add_index :hashtags_posts, [:hashtag_id, :post_id], unique: true
  end
end
