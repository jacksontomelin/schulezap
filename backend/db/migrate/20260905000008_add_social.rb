class AddSocial < ActiveRecord::Migration[7.1]
  def change
    # FOTO nos posts (guardamos a imagem em base64/URL — simples, sem storage externo)
    add_column :posts, :imagem_url, :text

    # BIO e capa no perfil
    add_column :usuarios, :bio, :string, limit: 160
    add_column :usuarios, :capa_cor, :string, default: "#F7B500"

    # REAÇÕES variadas: a coluna 'tipo' já existe em reacoes; só garantimos default
    # (curtida, amei, risada, uau, triste) — validado no model

    # RESPOSTA a comentário (comentário aninhado, 1 nível)
    add_reference :comentarios, :respondendo, foreign_key: { to_table: :comentarios }

    # AMIZADES (seguir): quem segue quem
    create_table :amizades do |t|
      t.references :seguidor, null: false, foreign_key: { to_table: :usuarios }
      t.references :seguido,  null: false, foreign_key: { to_table: :usuarios }
      t.timestamps
    end
    add_index :amizades, [:seguidor_id, :seguido_id], unique: true

    # SALVAR post (favoritos)
    create_table :salvamentos do |t|
      t.references :usuario, null: false, foreign_key: true
      t.references :post, null: false, foreign_key: true
      t.timestamps
    end
    add_index :salvamentos, [:usuario_id, :post_id], unique: true
  end
end
