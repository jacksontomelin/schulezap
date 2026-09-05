module Api
  module V1
    class PerfilController < ApplicationController
      before_action :autenticar!

      def show
        u = params[:id] ? usuario_atual.escola.usuarios.find(params[:id]) : usuario_atual
        posts = u.posts.joins(:grupo).where(grupos: { escola_id: u.escola_id })
        render json: {
          usuario: u.as_json_publico.merge(capa_cor: u.try(:capa_cor), capa_url: u.try(:capa_url)),
          escola: u.escola.nome,
          sou_eu: u.id == usuario_atual.id,
          eu_sigo: usuario_atual.segue?(u),
          stats: {
            posts: posts.count,
            curtidas: Reacao.where(post_id: posts.select(:id)).count,
            grupos: u.grupos.count,
            pontos: u.pontos,
            ranking: u.escola.usuarios.aluno.where("pontos > ?", u.pontos).count + 1,
            seguidores: u.seguidores.count,
            seguindo: u.seguindo.count
          },
          medalhas: u.medalhas.order(conquistada_em: :desc).map { |m| { chave: m.chave, titulo: m.titulo, icone: m.icone } }
        }
      end

      def update
        usuario_atual.update!(params.permit(:status_icone, :avatar_cor, :capa_cor, :bio, :nome_completo, :foto_url, :capa_url))
        render json: usuario_atual.as_json_publico
      end
    end
  end
end
