module Api
  module V1
    class GruposController < ApplicationController
      before_action :autenticar!

      def index
        grupos = usuario_atual.escola.grupos.order(:nome)
        meus = usuario_atual.grupos.pluck(:id).to_set
        render json: grupos.map { |g|
          { id: g.id, nome: g.nome, icone: g.icone, cor_tema: g.cor_tema,
            membros: g.membros_grupo.count, participando: meus.include?(g.id) }
        }
      end

      def show
        g = usuario_atual.escola.grupos.find(params[:id])
        render json: { id: g.id, nome: g.nome, icone: g.icone, cor_tema: g.cor_tema,
                       descricao: g.descricao, membros: g.membros_grupo.count,
                       participando: g.membro?(usuario_atual) }
      end

      def create
        g = usuario_atual.escola.grupos.create!(
          nome: params[:nome], icone: params[:icone] || "users",
          cor_tema: params[:cor_tema] || "red", criado_por: usuario_atual
        )
        MembroGrupo.create!(grupo: g, usuario: usuario_atual, papel_no_grupo: :moderador)
        render json: { id: g.id, nome: g.nome }, status: :created
      end

      def entrar
        g = usuario_atual.escola.grupos.find(params[:id])
        MembroGrupo.find_or_create_by!(grupo: g, usuario: usuario_atual)
        render json: { participando: true, membros: g.membros_grupo.count }
      end

      def sair
        g = usuario_atual.escola.grupos.find(params[:id])
        g.membros_grupo.where(usuario: usuario_atual).destroy_all
        render json: { participando: false, membros: g.membros_grupo.count }
      end
    end
  end
end
