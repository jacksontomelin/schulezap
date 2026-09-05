module Api
  module V1
    class BoletimController < ApplicationController
      before_action :autenticar!

      # GET /api/v1/boletim (ou ?usuario_id= para moderador ver de outro)
      def show
        alvo = if params[:usuario_id].present? && usuario_atual.moderador?
                 usuario_atual.escola.usuarios.find(params[:usuario_id])
               else
                 usuario_atual
               end

        notas = alvo.notas.includes(:disciplina).order("disciplinas.nome, bimestre")
        por_disciplina = notas.group_by(&:disciplina)

        materias = por_disciplina.map do |disc, ns|
          media = (ns.sum { |n| n.valor.to_f } / ns.size).round(1)
          {
            disciplina: disc.nome, icone: disc.icone,
            media: media,
            situacao: Nota.new(valor: media).situacao,
            bimestres: ns.map { |n| { bimestre: n.bimestre, valor: n.valor.to_f } }
          }
        end

        geral = materias.any? ? (materias.sum { |m| m[:media] } / materias.size).round(1) : nil

        render json: {
          aluno: alvo.as_json_publico,
          ano_letivo: Date.current.year.to_s,
          media_geral: geral,
          materias: materias.sort_by { |m| m[:disciplina] }
        }
      end

      # POST /api/v1/boletim/notas (moderador lança nota)
      def lancar
        return render_erro("Acesso restrito", :forbidden) unless usuario_atual.moderador?
        aluno = usuario_atual.escola.usuarios.find(params[:usuario_id])
        disc = usuario_atual.escola.disciplinas.find_or_create_by!(nome: params[:disciplina])
        n = Nota.find_or_initialize_by(usuario: aluno, disciplina: disc,
                                       bimestre: params[:bimestre].to_i,
                                       ano_letivo: Date.current.year.to_s)
        n.valor = params[:valor]
        n.lancada_por = usuario_atual
        n.save!
        render json: { ok: true, valor: n.valor.to_f }, status: :created
      end
    end
  end
end
