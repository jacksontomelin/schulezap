module Api
  module V1
    class ReacoesController < ApplicationController
      before_action :autenticar!

      # POST /api/v1/posts/:id/reagir  { tipo: "amei" }  (toggle inteligente)
      def toggle
        post = Post.visiveis.find(params[:id])
        tipo = params[:tipo].presence_in(Reacao::TIPOS) || "curtida"
        atual = post.reacoes.find_by(usuario: usuario_atual)

        if atual&.tipo == tipo
          atual.destroy                       # mesma reação: remove
        elsif atual
          atual.update!(tipo: tipo)           # troca de reação
        else
          post.reacoes.create!(usuario: usuario_atual, tipo: tipo)
        end

        post.reload
        render json: {
          minha_reacao: post.minha_reacao(usuario_atual),
          total: post.reacoes_count,
          por_tipo: post.reacoes_por_tipo
        }
      end
    end
  end
end
