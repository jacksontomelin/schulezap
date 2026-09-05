module Api
  module V1
    class StoriesController < ApplicationController
      before_action :autenticar!

      # GET /api/v1/stories — stories ativos, agrupados por autor
      # (eu + quem eu sigo + colegas da escola)
      def index
        ids = ([usuario_atual.id] + usuario_atual.seguindo.pluck(:id)).uniq
        ids = usuario_atual.escola.usuarios.pluck(:id) if ids.size <= 1  # escola toda se ainda não segue ninguém

        grupos = Story.ativos.where(usuario_id: ids).includes(:usuario).group_by(&:usuario_id)

        lista = grupos.map do |uid, sts|
          autor = sts.first.usuario
          {
            usuario: autor.as_json_publico,
            sou_eu: uid == usuario_atual.id,
            todos_vistos: sts.all? { |s| s.visto_por?(usuario_atual) },
            stories: sts.map { |s|
              { id: s.id, imagem_url: s.imagem_url, texto: s.texto, cor_fundo: s.cor_fundo,
                visto: s.visto_por?(usuario_atual), tempo: PostsController.tempo_rel(s.created_at) }
            }
          }
        end
        # eu primeiro, depois não vistos, depois vistos
        lista.sort_by! { |g| [g[:sou_eu] ? 0 : 1, g[:todos_vistos] ? 1 : 0] }
        render json: lista
      end

      # POST /api/v1/stories { imagem_url, texto, cor_fundo }
      def create
        s = usuario_atual.stories.create!(
          imagem_url: params[:imagem_url], texto: params[:texto],
          cor_fundo: params[:cor_fundo].presence || "#F7B500"
        )
        render json: { id: s.id, expira_em: s.expira_em.iso8601 }, status: :created
      end

      # POST /api/v1/stories/:id/visto
      def visto
        s = Story.ativos.find(params[:id])
        s.marcar_visto!(usuario_atual)
        render json: { ok: true }
      end

      # DELETE /api/v1/stories/:id
      def destroy
        s = usuario_atual.stories.find(params[:id])
        s.destroy
        render json: { ok: true }
      end
    end
  end
end
