module Api
  module V1
    class PostsController < ApplicationController
      before_action :autenticar!

      def index
        base = Post.visiveis.recentes.includes(:usuario, :grupo)
        if params[:grupo_id].present?
          escopo = base.where(grupo_id: params[:grupo_id])
        elsif params[:usuario_id].present?
          escopo = base.where(usuario_id: params[:usuario_id])
        elsif params[:so_fotos].present?
          escopo = base.where(usuario_id: params[:autor_id] || usuario_atual.id).where.not(imagem_url: nil)
        elsif params[:hashtag].present?
          h = Hashtag.find_by(nome: params[:hashtag].to_s.downcase)
          escopo = h ? base.where(id: h.posts.select(:id)) : base.none
        elsif params[:modo] == "seguindo"
          ids = usuario_atual.seguindo.pluck(:id) + [usuario_atual.id]
          escopo = base.where(usuario_id: ids)
        else
          ids = usuario_atual.grupos.pluck(:id)
          escopo = ids.any? ? base.where(grupo_id: ids) : base.joins(:grupo).where(grupos: { escola_id: usuario_atual.escola_id })
        end
        render json: escopo.limit(50).map { |p| self.class.serialize(p, usuario_atual) }
      end

      def create
        grupo = grupo_para_postar
        MembroGrupo.find_or_create_by!(grupo: grupo, usuario: usuario_atual)

        post = grupo.posts.new(usuario: usuario_atual, texto: params[:texto].to_s)
        fotos = params[:imagens].presence || [params[:imagem_url]].compact
        post.lista_imagens = fotos
        post.save!

        # enquete opcional
        if params[:enquete].present? && params[:enquete][:opcoes].present?
          e = post.create_enquete!(pergunta: params[:enquete][:pergunta].presence || post.texto)
          Array(params[:enquete][:opcoes]).first(4).each_with_index do |t, i|
            e.opcoes.create!(texto: t, ordem: i) if t.present?
          end
        end

        Mencao.registrar!(post.texto, autor: usuario_atual, post: post)
        Hashtag.registrar!(post.texto, post: post)

        render json: self.class.serialize(post.reload, usuario_atual), status: :created
      end

      # PATCH /api/v1/posts/:id — editar o proprio post
      def update
        post = usuario_atual.posts.find(params[:id])
        post.update!(texto: params[:texto].to_s, editado_em: Time.current)
        Hashtag.registrar!(post.texto, post: post)
        render json: self.class.serialize(post, usuario_atual)
      end

      # GET /api/v1/posts/:id/curtidas — quem reagiu
      def curtidas
        post = Post.visiveis.find(params[:id])
        render json: post.reacoes.includes(:usuario).map { |r|
          { tipo: r.tipo, usuario: r.usuario.as_json_publico }
        }
      end

      def destroy
        post = Post.find(params[:id])
        unless post.usuario_id == usuario_atual.id || usuario_atual.moderador?
          return render_erro("Você não pode remover este post", :forbidden)
        end
        post.ocultar!(usuario_atual)
        render json: { ok: true }
      end

      # serializer reutilizavel (usado tambem por salvos)
      def self.serialize(p, u)
        {
          id: p.id,
          texto: p.texto,
          imagem_url: p.imagem_url,
          created_at: p.created_at.iso8601,
          tempo: tempo_rel(p.created_at),
          grupo: { id: p.grupo_id, nome: p.grupo.nome },
          autor: p.usuario.as_json_publico,
          imagens: p.lista_imagens,
          editado: p.editado?,
          enquete: p.enquete && {
            id: p.enquete.id, pergunta: p.enquete.pergunta, total: p.enquete.total_votos,
            meu_voto: p.enquete.voto_de(u),
            opcoes: p.enquete.opcoes.order(:ordem).map { |o|
              { id: o.id, texto: o.texto, votos: o.votos.count }
            }
          },
          reacoes: p.reacoes_count,
          por_tipo: p.reacoes_por_tipo,
          minha_reacao: p.minha_reacao(u),
          comentarios: p.comentarios_count,
          salvo: Salvamento.exists?(usuario_id: u.id, post_id: p.id)
        }
      end

      def self.tempo_rel(t)
        s = (Time.current - t).to_i
        return "agora" if s < 60
        return "#{s / 60} min" if s < 3600
        return "#{s / 3600} h" if s < 86_400
        "#{s / 86_400} d"
      end

      private

      def grupo_para_postar
        return usuario_atual.escola.grupos.find(params[:grupo_id]) if params[:grupo_id].present?
        usuario_atual.grupos.first || usuario_atual.escola.grupos.first ||
          usuario_atual.escola.grupos.create!(nome: "Mural da Escola", icone: "school", cor_tema: "red")
      end
    end
  end
end
