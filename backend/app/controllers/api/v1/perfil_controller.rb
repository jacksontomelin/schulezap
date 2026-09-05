module Api
  module V1
    class PerfilController < ApplicationController
      before_action :autenticar!

      def show
        u = params[:id] ? usuario_atual.escola.usuarios.find(params[:id]) : usuario_atual
        posts = u.posts.joins(:grupo).where(grupos: { escola_id: u.escola_id })
        render json: {
          usuario: u.as_json_publico,
          escola: u.escola.nome,
          stats: {
            posts: posts.count,
            curtidas: Reacao.where(post_id: posts.select(:id)).count,
            grupos: u.grupos.count
          },
          medalhas: u.medalhas.order(conquistada_em: :desc).map { |m|
            { chave: m.chave, titulo: m.titulo, icone: m.icone }
          }
        }
      end

      def update
        usuario_atual.update!(update_params)
        render json: usuario_atual.as_json_publico
      end

      private

      def update_params
        params.permit(:status_icone, :avatar_cor, :nome_completo)
      end
    end
  end
end
