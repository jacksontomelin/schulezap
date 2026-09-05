class TokenService
  ALGO = "HS256"

  def self.secret
    ENV.fetch("SECRET_KEY_BASE") { Rails.application.secret_key_base }
  end

  def self.gerar(usuario)
    payload = {
      sub: usuario.id,
      escola_id: usuario.escola_id,
      papel: usuario.papel,
      exp: 30.days.from_now.to_i
    }
    JWT.encode(payload, secret, ALGO)
  end

  def self.decodificar(token)
    JWT.decode(token, secret, true, algorithm: ALGO).first
  rescue JWT::DecodeError, JWT::ExpiredSignature
    nil
  end
end
