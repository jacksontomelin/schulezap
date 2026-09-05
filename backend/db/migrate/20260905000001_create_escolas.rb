class CreateEscolas < ActiveRecord::Migration[7.1]
  def change
    create_table :escolas do |t|
      t.string :nome, null: false
      t.string :cidade, null: false, default: "Pomerode"
      t.string :uf, null: false, default: "SC", limit: 2
      t.string :slug, null: false

      t.timestamps
    end

    add_index :escolas, :slug, unique: true
  end
end
