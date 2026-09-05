module Api
  module V1
    class ConversasController < ApplicationController
      before_action :autenticar!

      # GET /api/v1/conversas — lista de conversas com ultima mensagem
      def index
        convs = Conversa.where("usuario_a_id = :id OR usuario_b_id = :id", id: usuario_atual.id)
                        .includes(:usuario_a, :usuario_b, :mensagens)
                        .order(Arel.sql("ultima_mensagem_em DESC NULLS LAST")).limit(50)

        render json: convs.map { |c|
          ultima = c.mensagens.order(created_at: :desc).first
          {
            id: c.id,
            com: c.outro(usuario_atual).as_json_publico,
            ultima: ultima && { texto: ultima.texto.truncate(48), minha: ultima.remetente_id == usuario_atual.id, tempo: PostsController.tempo_rel(ultima.created_at) },
            nao_lidas: c.nao_lidas_para(usuario_atual)
          }
        }
      end

      # POST /api/v1/conversas  { usuario_id }  — abre (ou acha) conversa
      def create
        outro = usuario_atual.escola.usuarios.find(params[:usuario_id])
        return render_erro("Não dá pra conversar com você mesmo") if outro.id == usuario_atual.id
        c = Conversa.entre(usuario_atual, outro)
        render json: { id: c.id, com: outro.as_json_publico }, status: :created
      end

      # GET /api/v1/conversas/:id/mensagens
      def mensagens
        c = conversa_do_usuario
        msgs = c.mensagens.order(:created_at).includes(:remetente).last(100)
        # marca como lidas as que nao sao minhas
        c.mensagens.where.not(remetente_id: usuario_atual.id).where(lida_em: nil).update_all(lida_em: Time.current)

        render json: {
          com: c.outro(usuario_atual).as_json_publico,
          mensagens: msgs.map { |m|
            { id: m.id, texto: m.texto, minha: m.remetente_id == usuario_atual.id,
              autor: m.remetente.apelido, tempo: PostsController.tempo_rel(m.created_at),
              created_at: m.created_at.iso8601 }
          }
        }
      end

      # POST /api/v1/conversas/:id/mensagens { texto }
      def enviar
        c = conversa_do_usuario
        m = c.mensagens.create!(remetente: usuario_atual, texto: params[:texto])
        render json: { id: m.id, texto: m.texto, minha: true, tempo: "agora", created_at: m.created_at.iso8601 }, status: :created
      end

      private

      def conversa_do_usuario
        c = Conversa.find(params[:id])
        raise ActiveRecord::RecordNotFound unless c.participa?(usuario_atual)
        c
      end
    end
  end
end
