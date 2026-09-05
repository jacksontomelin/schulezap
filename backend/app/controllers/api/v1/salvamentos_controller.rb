module Api
  module V1
    class SalvamentosController < ApplicationController
      before_action :autenticar!

      # POST /api/v1/posts/:id/salvar (toggle)
      def toggle
        post = Post.visiveis.find(params[:id])
        s = Salvamento.find_by(usuario: usuario_atual, post: post)
        if s then s.destroy; salvo = false else Salvamento.create!(usuario: usuario_atual, post: post); salvo = true end
        render json: { salvo: salvo }
      end

      # GET /api/v1/salvos
      def index
        posts = usuario_atual.posts_salvos.visiveis.recentes.includes(:usuario, :grupo).limit(50)
        render json: posts.map { |p| PostsController.serialize(p, usuario_atual) }
      end
    end
  end
end
