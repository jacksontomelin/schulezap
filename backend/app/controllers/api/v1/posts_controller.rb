module Api
  module V1
    class PostsController < ApplicationController
      before_action :autenticar!

      # GET /api/v1/feed  (ou ?grupo_id=)
      def index
        base = Post.visiveis.recentes.includes(:usuario, :grupo)

        if params[:grupo_id].present?
          escopo = base.where(grupo_id: params[:grupo_id])
        else
          ids_grupos = usuario_atual.grupos.pluck(:id)
          escopo = if ids_grupos.any?
                     base.where(grupo_id: ids_grupos)
                   else
                     # ainda sem grupos: mostra o mural da escola pra tela nao ficar vazia
                     base.joins(:grupo).where(grupos: { escola_id: usuario_atual.escola_id })
                   end
        end
        posts = escopo.limit(50)

        render json: posts.map { |p| serialize_post(p) }
      end

      # POST /api/v1/posts
      def create
        grupo = grupo_para_postar
        MembroGrupo.find_or_create_by!(grupo: grupo, usuario: usuario_atual)
        post = grupo.posts.create!(usuario: usuario_atual, texto: params[:texto])
        render json: serialize_post(post), status: :created
      end

      # DELETE /api/v1/posts/:id  (autor ou moderador)
      def destroy
        post = Post.find(params[:id])
        unless post.usuario_id == usuario_atual.id || usuario_atual.moderador?
          return render_erro("Você não pode remover este post", :forbidden)
        end
        post.ocultar!(usuario_atual)
        render json: { ok: true }
      end

      private

      # escolhe onde postar: grupo pedido, senao o primeiro grupo do usuario,
      # senao o grupo geral da turma (criado se preciso). Ninguem fica travado.
      def grupo_para_postar
        if params[:grupo_id].present?
          return usuario_atual.escola.grupos.find(params[:grupo_id])
        end
        usuario_atual.grupos.first || usuario_atual.escola.grupos.first ||
          usuario_atual.escola.grupos.create!(nome: "Mural da Escola", icone: "school", cor_tema: "red")
      end

      def serialize_post(p)
        {
          id: p.id,
          texto: p.texto,
          created_at: p.created_at.iso8601,
          tempo: tempo_relativo(p.created_at),
          grupo: { id: p.grupo_id, nome: p.grupo.nome },
          autor: p.usuario.as_json_publico,
          reacoes: p.reacoes_count,
          comentarios: p.comentarios_count,
          eu_reagi: p.reagiu?(usuario_atual)
        }
      end

      def tempo_relativo(t)
        s = (Time.current - t).to_i
        return "agora" if s < 60
        return "#{s / 60} min" if s < 3600
        return "#{s / 3600} h" if s < 86_400
        "#{s / 86_400} d"
      end
    end
  end
end
