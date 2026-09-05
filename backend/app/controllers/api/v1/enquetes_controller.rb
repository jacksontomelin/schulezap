module Api
  module V1
    class EnquetesController < ApplicationController
      before_action :autenticar!

      # POST /api/v1/enquetes/:id/votar { opcao_id }
      def votar
        e = Enquete.find(params[:id])
        return render_erro("Você já votou nesta enquete") if e.votou?(usuario_atual)
        opcao = e.opcoes.find(params[:opcao_id])
        VotoEnquete.create!(enquete: e, opcao: opcao, usuario: usuario_atual)
        render json: {
          total: e.reload.total_votos, meu_voto: opcao.id,
          opcoes: e.opcoes.order(:ordem).map { |o| { id: o.id, texto: o.texto, votos: o.votos.count } }
        }
      end
    end
  end
end
