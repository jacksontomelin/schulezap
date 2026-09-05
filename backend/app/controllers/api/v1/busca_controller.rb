module Api
  module V1
    class BuscaController < ApplicationController
      before_action :autenticar!

      # GET /api/v1/busca?q=texto  -> pessoas + grupos
      def index
        q = params[:q].to_s.strip
        return render(json: { pessoas: [], grupos: [] }) if q.length < 2

        pessoas = usuario_atual.escola.usuarios
                    .where("apelido ILIKE ?", "%#{q}%").limit(10)
        grupos = usuario_atual.escola.grupos
                   .where("nome ILIKE ?", "%#{q}%").limit(10)

        render json: {
          pessoas: pessoas.map { |u| u.as_json_publico.merge(eu_sigo: usuario_atual.segue?(u)) },
          grupos: grupos.map { |g| { id: g.id, nome: g.nome, icone: g.icone, membros: g.membros_grupo.count } }
        }
      end
    end
  end
end
