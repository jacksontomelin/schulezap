module Api
  module V1
    class AvisosController < ApplicationController
      before_action :autenticar!
      before_action :exigir_moderador!, only: %i[create destroy]

      # GET /api/v1/avisos
      def index
        lista = usuario_atual.escola.avisos.para(usuario_atual).recentes.includes(:autor).limit(50)
        render json: lista.map { |a| serialize(a) }
      end

      # POST /api/v1/avisos (só responsável/admin)
      def create
        a = usuario_atual.escola.avisos.create!(
          autor: usuario_atual, titulo: params[:titulo], corpo: params[:corpo],
          categoria: params[:categoria].presence || "geral",
          turma_alvo: params[:turma_alvo].presence, fixado: params[:fixado] == true,
          evento_em: params[:evento_em]
        )
        render json: serialize(a), status: :created
      end

      # POST /api/v1/avisos/:id/lido
      def lido
        a = usuario_atual.escola.avisos.find(params[:id])
        a.marcar_lido!(usuario_atual)
        render json: { ok: true }
      end

      def destroy
        usuario_atual.escola.avisos.find(params[:id]).destroy
        render json: { ok: true }
      end

      private

      def serialize(a)
        {
          id: a.id, titulo: a.titulo, corpo: a.corpo, categoria: a.categoria,
          turma_alvo: a.turma_alvo, fixado: a.fixado,
          evento_em: a.evento_em&.iso8601,
          autor: a.autor.as_json_publico,
          tempo: PostsController.tempo_rel(a.created_at),
          lido: a.lido_por?(usuario_atual),
          nao_lidos: a.leituras.count
        }
      end
    end
  end
end
