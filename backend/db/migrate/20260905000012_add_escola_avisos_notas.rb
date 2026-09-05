class AddEscolaAvisosNotas < ActiveRecord::Migration[7.1]
  def change
    # dados escolares do aluno (cartão do aluno)
    add_column :usuarios, :turma, :string, limit: 20      # ex.: "8º Ano A"
    add_column :usuarios, :periodo, :string, limit: 20    # manhã/tarde

    # AVISOS oficiais da escola (só moderador publica)
    create_table :avisos do |t|
      t.references :escola, null: false, foreign_key: true
      t.references :autor, null: false, foreign_key: { to_table: :usuarios }
      t.string  :titulo, null: false
      t.text    :corpo, null: false
      t.string  :categoria, default: "geral"   # geral, evento, reuniao, esporte
      t.string  :turma_alvo                    # nil = todas as turmas
      t.boolean :fixado, null: false, default: false
      t.datetime :evento_em
      t.timestamps
    end
    add_index :avisos, [:escola_id, :created_at]

    # quem já leu o aviso
    create_table :leituras_aviso do |t|
      t.references :aviso, null: false, foreign_key: true
      t.references :usuario, null: false, foreign_key: true
      t.timestamps
    end
    add_index :leituras_aviso, [:aviso_id, :usuario_id], unique: true

    # DISCIPLINAS e NOTAS (boletim)
    create_table :disciplinas do |t|
      t.references :escola, null: false, foreign_key: true
      t.string :nome, null: false
      t.string :icone, default: "book"
      t.timestamps
    end
    add_index :disciplinas, [:escola_id, :nome], unique: true

    create_table :notas do |t|
      t.references :usuario, null: false, foreign_key: true
      t.references :disciplina, null: false, foreign_key: true
      t.references :lancada_por, foreign_key: { to_table: :usuarios }
      t.decimal :valor, precision: 4, scale: 2, null: false
      t.integer :bimestre, null: false, default: 1
      t.string  :ano_letivo, null: false
      t.timestamps
    end
    add_index :notas, [:usuario_id, :disciplina_id, :bimestre, :ano_letivo], unique: true, name: "idx_notas_uniq"

    # AGENDA / tarefas da turma
    create_table :agendas do |t|
      t.references :escola, null: false, foreign_key: true
      t.references :disciplina, foreign_key: true
      t.string  :titulo, null: false
      t.text    :descricao
      t.string  :turma_alvo
      t.string  :tipo, default: "tarefa"   # tarefa, prova, evento
      t.date    :data, null: false
      t.timestamps
    end
    add_index :agendas, [:escola_id, :data]
  end
end
