class ApplicationController < ActionController::API
  rescue_from ActiveRecord::RecordNotFound, with: :nao_encontrado
  rescue_from ActiveRecord::RecordInvalid, with: :invalido

  private

  def usuario_atual
    return @usuario_atual if defined?(@usuario_atual)

    token = request.headers["Authorization"]&.split(" ")&.last
    payload = token && TokenService.decodificar(token)
    @usuario_atual = payload && Usuario.find_by(id: payload["sub"])
  end

  def autenticar!
    render_erro("Faça login para continuar", :unauthorized) unless usuario_atual
  end

  def exigir_moderador!
    autenticar!
    return if performed?
    render_erro("Acesso restrito", :forbidden) unless usuario_atual.moderador?
  end

  def render_erro(mensagem, status = :unprocessable_entity)
    render json: { erro: mensagem }, status: status
  end

  def nao_encontrado
    render_erro("Não encontrado", :not_found)
  end

  def invalido(e)
    render_erro(e.record.errors.full_messages.join(", "))
  end
end
