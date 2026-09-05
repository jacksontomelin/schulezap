module Api
  module V1
    class NotificacoesController < ApplicationController
      before_action :autenticar!

      # GET /api/v1/notificacoes — curtidas e comentarios nos meus posts (7 dias) + medalhas
      def index
        meus_posts = usuario_atual.posts.select(:id)
        desde = 7.days.ago

        curtidas = Reacao.where(post_id: meus_posts).where("reacoes.created_at > ?", desde)
                         .where.not(usuario_id: usuario_atual.id)
                         .includes(:usuario, :post).order(created_at: :desc).limit(20)
        comentarios = Comentario.where(post_id: meus_posts).where("comentarios.created_at > ?", desde)
                                .where.not(usuario_id: usuario_atual.id)
                                .includes(:usuario, :post).order(created_at: :desc).limit(20)
        medalhas = usuario_atual.medalhas.where("conquistada_em > ?", desde).order(conquistada_em: :desc)

        itens = []
        curtidas.each { |r| itens << { tipo: "curtida", quem: r.usuario.as_json_publico, post_id: r.post_id, texto: r.post.texto.truncate(60), quando: r.created_at } }
        comentarios.each { |c| itens << { tipo: "comentario", quem: c.usuario.as_json_publico, post_id: c.post_id, texto: c.texto.truncate(60), quando: c.created_at } }
        medalhas.each { |m| itens << { tipo: "medalha", titulo: m.titulo, icone: m.icone, quando: m.conquistada_em } }

        itens.sort_by! { |i| -i[:quando].to_i }
        render json: itens.first(30).map { |i| i.merge(quando: i[:quando].iso8601, tempo: tempo_relativo(i[:quando])) }
      end

      private

      def tempo_relativo(t)
        s = (Time.current - t).to_i
        return "agora" if s < 60
        return "#{s / 60} min" if s < 3600
        return "#{s / 3600} h" if s < 86_400
        "#{s / 86_400} d"
      end
    end
  end
end
