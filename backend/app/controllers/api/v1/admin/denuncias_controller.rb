module Api
  module V1
    module Admin
      class DenunciasController < ApplicationController
        before_action :exigir_moderador!

        def index
          d = Denuncia.pendentes.where(post: posts_da_escola).includes(post: :usuario).order(created_at: :desc)
          render json: d.map { |x|
            { id: x.id, motivo: x.motivo, created_at: x.created_at.iso8601,
              post: { id: x.post_id, texto: x.post.texto, autor: x.post.usuario.apelido } }
          }
        end

        # PATCH /admin/denuncias/:id  { acao: "ocultar" | "descartar" }
        def resolver
          d = Denuncia.where(post: posts_da_escola).find(params[:id])
          if params[:acao] == "ocultar"
            d.post.ocultar!(usuario_atual)
            d.update!(status: :resolvida, resolvida_por: usuario_atual)
          else
            d.update!(status: :descartada, resolvida_por: usuario_atual)
          end
          render json: { ok: true }
        end

        private

        def posts_da_escola
          Post.joins(:grupo).where(grupos: { escola_id: usuario_atual.escola_id })
        end
      end
    end
  end
end
