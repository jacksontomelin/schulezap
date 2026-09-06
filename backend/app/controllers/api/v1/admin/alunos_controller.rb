module Api
  module V1
    module Admin
      class AlunosController < ApplicationController
        before_action :exigir_moderador!

        # GET /api/v1/admin/alunos — lista para o painel da escola
        def index
          lista = usuario_atual.escola.usuarios.order(:turma, :apelido)
          render json: lista.map { |u|
            {
              **u.as_json_publico.symbolize_keys,
              periodo: u.periodo,
              papel: u.papel,
              notas: u.notas.count,
              ultimo_acesso: u.ultimo_acesso_em&.iso8601
            }
          }
        end

        # PATCH /api/v1/admin/alunos/:id — turma, período, comunicação assistiva
        def update
          u = usuario_atual.escola.usuarios.find(params[:id])
          u.update!(params.permit(:turma, :periodo, :comunicacao_assistiva))
          render json: u.as_json_publico.merge(periodo: u.periodo)
        end

        # GET /api/v1/admin/turmas — turmas existentes (para os seletores)
        def turmas
          nomes = usuario_atual.escola.usuarios.where.not(turma: [nil, ""]).distinct.pluck(:turma).sort
          render json: { turmas: nomes, disciplinas: usuario_atual.escola.disciplinas.order(:nome).pluck(:nome) }
        end
      end
    end
  end
end
