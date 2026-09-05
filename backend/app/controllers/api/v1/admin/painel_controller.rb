module Api
  module V1
    module Admin
      class PainelController < ApplicationController
        before_action :exigir_moderador!

        def show
          escola = usuario_atual.escola
          posts = Post.joins(:grupo).where(grupos: { escola_id: escola.id })
          render json: {
            escola: escola.nome,
            alunos: escola.usuarios.where(papel: :aluno).count,
            convites_gerados: escola.convites.count,
            convites_usados: escola.convites.where.not(usado_por_id: nil).count,
            posts_semana: posts.where("posts.created_at > ?", 7.days.ago).count,
            denuncias_abertas: Denuncia.pendentes.where(post: posts).count
          }
        end
      end
    end
  end
end
