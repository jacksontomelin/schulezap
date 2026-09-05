module Api
  module V1
    class FalaController < ApplicationController
      before_action :autenticar!

      # POST /api/v1/fala/pedidos { categoria, item, rotulo, frase, urgente }
      # Registra o que o aluno tocou no painel de comunicação.
      def criar
        p = PedidoFala.create!(
          usuario: usuario_atual, escola: usuario_atual.escola,
          categoria: params[:categoria], item: params[:item],
          rotulo: params[:rotulo], frase: params[:frase],
          urgente: params[:urgente] == true
        )
        render json: { id: p.id, ok: true }, status: :created
      end

      # GET /api/v1/fala/pedidos — fila de pedidos (só moderador)
      def index
        return render_erro("Acesso restrito", :forbidden) unless usuario_atual.moderador?

        lista = usuario_atual.escola.pedidos_fala
                             .includes(:usuario, :atendido_por)
                             .where("created_at > ?", 24.hours.ago)
                             .recentes.limit(50)
        render json: {
          abertos: lista.reject(&:atendido?).map { |p| serialize(p) },
          atendidos: lista.select(&:atendido?).first(15).map { |p| serialize(p) }
        }
      end

      # POST /api/v1/fala/pedidos/:id/atender
      def atender
        return render_erro("Acesso restrito", :forbidden) unless usuario_atual.moderador?
        p = usuario_atual.escola.pedidos_fala.find(params[:id])
        p.atender!(usuario_atual)
        render json: { ok: true, atendido_por: usuario_atual.apelido }
      end

      # GET /api/v1/fala/meus — histórico do próprio aluno
      def meus
        lista = usuario_atual.pedidos_fala.recentes.limit(30)
        render json: lista.map { |p| serialize(p) }
      end

      # PATCH /api/v1/fala/config { ativo, falacomigo_url } — liga/desliga
      def config
        alvo = if params[:usuario_id].present? && usuario_atual.moderador?
                 usuario_atual.escola.usuarios.find(params[:usuario_id])
               else
                 usuario_atual
               end
        alvo.update!(
          comunicacao_assistiva: params[:ativo] == true,
          falacomigo_url: params[:falacomigo_url]
        )
        render json: { ok: true, ativo: alvo.comunicacao_assistiva, url: alvo.falacomigo_url }
      end

      private

      def serialize(p)
        {
          id: p.id, categoria: p.categoria, item: p.item, rotulo: p.rotulo,
          frase: p.frase, urgente: p.urgente,
          aluno: p.usuario.as_json_publico,
          tempo: PostsController.tempo_rel(p.created_at),
          created_at: p.created_at.iso8601,
          atendido: p.atendido?,
          atendido_por: p.atendido_por&.apelido
        }
      end
    end
  end
end
