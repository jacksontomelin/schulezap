module Api
  module V1
    class DenunciasController < ApplicationController
      before_action :autenticar!

      # POST /api/v1/posts/:id/denunciar
      def create
        post = Post.visiveis.find(params[:id])
        Denuncia.create!(post: post, denunciado_por: usuario_atual, motivo: params[:motivo])
        render json: { ok: true, mensagem: "Denúncia enviada. Um responsável vai avaliar." }, status: :created
      end
    end
  end
end
