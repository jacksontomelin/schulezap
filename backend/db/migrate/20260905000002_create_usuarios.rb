class CreateUsuarios < ActiveRecord::Migration[7.1]
  def change
    create_table :usuarios do |t|
      t.references :escola, null: false, foreign_key: true

      t.string :apelido, null: false
      t.string :nome_completo
      t.string :email
      t.string :senha_digest, null: false

      # papel: 0 = aluno, 1 = responsavel, 2 = admin
      t.integer :papel, null: false, default: 0

      # personalizacao (nada de dado sensivel exposto)
      t.string :avatar_inicial, limit: 1
      t.string :avatar_cor, default: "#C62828"
      t.string :status_icone, default: "gamepad"

      t.datetime :ultimo_acesso_em

      t.timestamps
    end

    add_index :usuarios, [:escola_id, :apelido], unique: true
    add_index :usuarios, :email, unique: true, where: "email IS NOT NULL"
    add_index :usuarios, :papel
  end
end
