module Api
  module V1
    class ComentariosController < ApplicationController
      before_action :autenticar!

      def index
        post = Post.visiveis.find(params[:post_id])
        coments = post.comentarios.visiveis.order(:created_at).includes(:usuario)
        render json: coments.map { |c|
          { id: c.id, texto: c.texto, autor: c.usuario.as_json_publico, respondendo_id: c.respondendo_id, created_at: c.created_at.iso8601 }
        }
      end

      def create
        post = Post.visiveis.find(params[:post_id])
        c = post.comentarios.create!(usuario: usuario_atual, texto: params[:texto], respondendo_id: params[:respondendo_id])
        Mencao.registrar!(c.texto, autor: usuario_atual, comentario: c)
        render json: { id: c.id, texto: c.texto, autor: usuario_atual.as_json_publico, respondendo_id: c.respondendo_id, created_at: c.created_at.iso8601 }, status: :created
      end
    end
  end
end
