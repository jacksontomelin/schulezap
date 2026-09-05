module Api
  module V1
    class RankingController < ApplicationController
      before_action :autenticar!

      # GET /api/v1/ranking — top 20 da escola + posicao do usuario
      def index
        top = usuario_atual.escola.usuarios.aluno.order(pontos: :desc, apelido: :asc).limit(20)
        minha_pos = usuario_atual.escola.usuarios.aluno.where("pontos > ?", usuario_atual.pontos).count + 1

        render json: {
          minha_posicao: minha_pos,
          meus_pontos: usuario_atual.pontos,
          top: top.each_with_index.map { |u, i|
            { posicao: i + 1, usuario: u.as_json_publico, pontos: u.pontos, eu: u.id == usuario_atual.id }
          }
        }
      end
    end
  end
end
