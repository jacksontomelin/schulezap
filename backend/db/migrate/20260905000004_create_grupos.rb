class CreateGrupos < ActiveRecord::Migration[7.1]
  def change
    create_table :grupos do |t|
      t.references :escola, null: false, foreign_key: true
      t.references :criado_por, foreign_key: { to_table: :usuarios }

      t.string :nome, null: false
      t.string :icone, default: "users"
      t.string :cor_tema, default: "red"
      t.text :descricao

      t.timestamps
    end

    add_index :grupos, [:escola_id, :nome], unique: true

    create_table :membros_grupo do |t|
      t.references :grupo, null: false, foreign_key: true
      t.references :usuario, null: false, foreign_key: true
      t.integer :papel_no_grupo, null: false, default: 0 # 0 = membro, 1 = moderador

      t.timestamps
    end

    add_index :membros_grupo, [:grupo_id, :usuario_id], unique: true
  end
end
