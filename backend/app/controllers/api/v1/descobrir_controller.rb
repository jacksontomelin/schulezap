module Api
  module V1
    class DescobrirController < ApplicationController
      before_action :autenticar!

      # GET /api/v1/descobrir — sugestoes de pessoas + hashtags em alta
      def index
        ja_sigo = usuario_atual.seguindo.pluck(:id) + [usuario_atual.id]
        sugestoes = usuario_atual.escola.usuarios.where.not(id: ja_sigo)
                                 .order(pontos: :desc).limit(8)
        render json: {
          pessoas: sugestoes.map { |u|
            { **u.as_json_publico.symbolize_keys, seguidores: u.seguidores.count }
          },
          hashtags: Hashtag.em_alta.map { |h| { nome: h.nome, usos: h.usos } }
        }
      end

      # GET /api/v1/usuarios/:id/seguidores
      def seguidores
        u = usuario_atual.escola.usuarios.find(params[:id])
        render json: u.seguidores.map { |s| s.as_json_publico.merge(eu_sigo: usuario_atual.segue?(s)) }
      end

      # GET /api/v1/usuarios/:id/seguindo
      def seguindo
        u = usuario_atual.escola.usuarios.find(params[:id])
        render json: u.seguindo.map { |s| s.as_json_publico.merge(eu_sigo: usuario_atual.segue?(s)) }
      end
    end
  end
end
