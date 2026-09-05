module Api
  module V1
    class ComentariosController < ApplicationController
      before_action :autenticar!

      def index
        post = Post.visiveis.find(params[:post_id])
        coments = post.comentarios.visiveis.order(:created_at).includes(:usuario)
        render json: coments.map { |c|
          { id: c.id, texto: c.texto, autor: c.usuario.as_json_publico, created_at: c.created_at.iso8601 }
        }
      end

      def create
        post = Post.visiveis.find(params[:post_id])
        c = post.comentarios.create!(usuario: usuario_atual, texto: params[:texto])
        render json: { id: c.id, texto: c.texto, autor: usuario_atual.as_json_publico, created_at: c.created_at.iso8601 }, status: :created
      end
    end
  end
end
