module Api
  module V1
    class AgendaController < ApplicationController
      before_action :autenticar!

      # GET /api/v1/agenda — próximos compromissos da turma
      def index
        itens = usuario_atual.escola.agendas.para(usuario_atual).proximas.includes(:disciplina).limit(12)
        render json: itens.map { |a|
          { id: a.id, titulo: a.titulo, descricao: a.descricao, tipo: a.tipo,
            data: a.data.iso8601, dia: a.data.day, mes: I18n.l(a.data, format: "%b") rescue a.data.strftime("%b"),
            disciplina: a.disciplina&.nome }
        }
      end

      def create
        return render_erro("Acesso restrito", :forbidden) unless usuario_atual.moderador?
        disc = params[:disciplina].present? ? usuario_atual.escola.disciplinas.find_or_create_by!(nome: params[:disciplina]) : nil
        a = usuario_atual.escola.agendas.create!(
          titulo: params[:titulo], descricao: params[:descricao], tipo: params[:tipo].presence || "tarefa",
          data: params[:data], turma_alvo: params[:turma_alvo].presence, disciplina: disc
        )
        render json: { id: a.id }, status: :created
      end
    end
  end
end
