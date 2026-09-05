module Api
  module V1
    class DesafiosController < ApplicationController
      before_action :autenticar!

      PONTOS_POR_ACERTO = 10
      BONUS_PERFEITO = 20

      # POST /api/v1/desafios/:desafio/resultado  { acertos, total }
      # Registra o resultado do dia, soma pontos e concede medalhas.
      def resultado
        desafio = params[:desafio].to_s
        return render_erro("Desafio inválido") unless ResultadoDesafio::DESAFIOS.include?(desafio)

        acertos = params[:acertos].to_i.clamp(0, 50)
        total   = [params[:total].to_i, 1].max

        if ResultadoDesafio.exists?(usuario: usuario_atual, desafio: desafio, dia: Date.current)
          return render json: { ja_jogou: true, pontos: usuario_atual.pontos, medalhas_novas: [] }
        end

        pontos = acertos * PONTOS_POR_ACERTO
        pontos += BONUS_PERFEITO if acertos == total && total > 0

        medalhas_novas = []
        ActiveRecord::Base.transaction do
          ResultadoDesafio.create!(usuario: usuario_atual, desafio: desafio, acertos: acertos, total: total, pontos_ganhos: pontos)
          usuario_atual.pontuar!(pontos)

          medalhas_novas << usuario_atual.conceder_medalha!("primeiro_desafio", "Primeiro desafio", "sparkles")
          if acertos == total && total > 0
            titulo = { "quiz" => "Quiz perfeito", "palavra" => "Mestre do alemão", "placar" => "Palpiteiro" }[desafio]
            medalhas_novas << usuario_atual.conceder_medalha!("#{desafio}_perfeito", titulo, "trophy")
          end
          if usuario_atual.resultados_desafio.count >= 7
            medalhas_novas << usuario_atual.conceder_medalha!("sete_desafios", "7 desafios", "flame")
          end
        end

        render json: {
          ja_jogou: false,
          pontos_ganhos: pontos,
          pontos: usuario_atual.pontos,
          medalhas_novas: medalhas_novas.compact.map { |m| { chave: m.chave, titulo: m.titulo, icone: m.icone } }
        }
      end

      # GET /api/v1/desafios/hoje — o que ja foi jogado hoje
      def hoje
        jogados = ResultadoDesafio.where(usuario: usuario_atual, dia: Date.current).pluck(:desafio)
        render json: { jogados: jogados, pontos: usuario_atual.pontos }
      end
    end
  end
end
