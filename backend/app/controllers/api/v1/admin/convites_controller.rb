module Api
  module V1
    module Admin
      class ConvitesController < ApplicationController
        before_action :exigir_moderador!

        def index
          c = usuario_atual.escola.convites.order(created_at: :desc).limit(100)
          render json: c.map { |x|
            { id: x.id, codigo: x.codigo, turma: x.turma_sugerida,
              usado: x.usado?, usado_por: x.usado_por&.apelido }
          }
        end

        # POST /admin/convites  { turma: "6B", quantidade: 5 }
        def create
          qtd = [[params[:quantidade].to_i, 1].max, 50].min
          criados = qtd.times.map do
            usuario_atual.escola.convites.create!(
              turma_sugerida: params[:turma], gerado_por: usuario_atual
            )
          end
          render json: criados.map { |c| { codigo: c.codigo, turma: c.turma_sugerida } }, status: :created
        end
      end
    end
  end
end
