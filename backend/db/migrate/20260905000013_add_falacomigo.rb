class AddFalacomigo < ActiveRecord::Migration[7.1]
  def change
    # aluno pode ter comunicação assistiva ativada (sem guardar diagnóstico)
    add_column :usuarios, :comunicacao_assistiva, :boolean, null: false, default: false
    add_column :usuarios, :falacomigo_url, :string   # link do app do aluno (opcional)

    # pedidos feitos pelo painel de comunicação (o que o aluno tocou)
    create_table :pedidos_fala do |t|
      t.references :usuario, null: false, foreign_key: true
      t.references :escola, null: false, foreign_key: true
      t.string  :categoria, null: false     # sos, sentimento, sensorial...
      t.string  :item, null: false          # id do cartão
      t.string  :rotulo, null: false        # "SOCORRO"
      t.text    :frase, null: false         # "Eu preciso de ajuda agora!"
      t.boolean :urgente, null: false, default: false
      t.references :atendido_por, foreign_key: { to_table: :usuarios }
      t.datetime :atendido_em
      t.timestamps
    end
    add_index :pedidos_fala, [:escola_id, :created_at]
    add_index :pedidos_fala, [:usuario_id, :created_at]
  end
end
