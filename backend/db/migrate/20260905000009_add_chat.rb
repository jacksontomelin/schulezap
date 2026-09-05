class AddChat < ActiveRecord::Migration[7.1]
  def change
    # conversa entre dois usuarios (1:1) — par ordenado para evitar duplicata
    create_table :conversas do |t|
      t.references :usuario_a, null: false, foreign_key: { to_table: :usuarios }
      t.references :usuario_b, null: false, foreign_key: { to_table: :usuarios }
      t.datetime :ultima_mensagem_em
      t.timestamps
    end
    add_index :conversas, [:usuario_a_id, :usuario_b_id], unique: true

    create_table :mensagens do |t|
      t.references :conversa, null: false, foreign_key: true
      t.references :remetente, null: false, foreign_key: { to_table: :usuarios }
      t.text :texto, null: false
      t.datetime :lida_em
      t.timestamps
    end
    add_index :mensagens, [:conversa_id, :created_at]
  end
end
