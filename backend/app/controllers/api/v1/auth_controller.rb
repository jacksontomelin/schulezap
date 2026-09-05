module Api
  module V1
    class AuthController < ApplicationController
      before_action :autenticar!, only: :eu

      # POST /api/v1/auth/resgatar
      # Cria conta usando um codigo de convite.
      def resgatar
        convite = Convite.find_by(codigo: params[:codigo].to_s.strip.upcase)
        return render_erro("Código de convite inválido") unless convite
        return render_erro("Este convite já foi usado") if convite.usado?
        return render_erro("Este convite expirou") if convite.expirado?

        usuario = nil
        ActiveRecord::Base.transaction do
          usuario = Usuario.create!(
            escola: convite.escola,
            apelido: params[:apelido],
            nome_completo: params[:nome_completo],
            senha: params[:senha].presence || SecureRandom.hex(8),
            papel: :aluno
          )
          convite.resgatar!(usuario)
          entrar_em_grupo_da_turma(usuario, convite)
        end

        render json: { token: TokenService.gerar(usuario), usuario: usuario.as_json_publico }, status: :created
      end

      # POST /api/v1/auth/entrar
      # Login com apelido + senha (dentro de uma escola).
      def entrar
        escola = Escola.find_by(slug: params[:escola_slug]) || Escola.first
        usuario = escola&.usuarios&.find_by("lower(apelido) = ?", params[:apelido].to_s.downcase)

        if usuario&.authenticate(params[:senha])
          usuario.update_column(:ultimo_acesso_em, Time.current)
          render json: { token: TokenService.gerar(usuario), usuario: usuario.as_json_publico }
        else
          render_erro("Apelido ou senha incorretos", :unauthorized)
        end
      end

      # GET /api/v1/auth/eu
      def eu
        render json: usuario_atual.as_json_publico
      end

      private

      def entrar_em_grupo_da_turma(usuario, convite)
        return unless convite.turma_sugerida.present?

        grupo = usuario.escola.grupos.find_or_create_by!(nome: "Turma #{convite.turma_sugerida}") do |g|
          g.icone = "school"
          g.cor_tema = "red"
        end
        MembroGrupo.find_or_create_by!(grupo: grupo, usuario: usuario)
      end
    end
  end
end
