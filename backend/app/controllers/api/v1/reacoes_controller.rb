module Api
  module V1
    class ReacoesController < ApplicationController
      before_action :autenticar!

      # POST /api/v1/posts/:id/reagir  (toggle curtida)
      def toggle
        post = Post.visiveis.find(params[:id])
        reacao = post.reacoes.find_by(usuario: usuario_atual)

        if reacao
          reacao.destroy
          reagi = false
        else
          post.reacoes.create!(usuario: usuario_atual)
          reagi = true
        end

        render json: { eu_reagi: reagi, reacoes: post.reload.reacoes_count }
      end
    end
  end
end
