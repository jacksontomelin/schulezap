module Api
  module V1
    class AmizadesController < ApplicationController
      before_action :autenticar!

      # POST /api/v1/usuarios/:id/seguir  (toggle)
      def seguir
        alvo = usuario_atual.escola.usuarios.find(params[:id])
        return render_erro("Não dá pra seguir você mesmo") if alvo.id == usuario_atual.id

        rel = Amizade.find_by(seguidor: usuario_atual, seguido: alvo)
        if rel
          rel.destroy
          render json: { seguindo: false, seguidores: alvo.seguidores.count }
        else
          Amizade.create!(seguidor: usuario_atual, seguido: alvo)
          render json: { seguindo: true, seguidores: alvo.seguidores.count }
        end
      end
    end
  end
end
