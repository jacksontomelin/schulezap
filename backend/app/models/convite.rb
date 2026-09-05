class Convite < ApplicationRecord
  belongs_to :escola
  belongs_to :gerado_por, class_name: "Usuario", optional: true
  belongs_to :usado_por, class_name: "Usuario", optional: true

  validates :codigo, presence: true, uniqueness: true

  before_validation :gerar_codigo, on: :create

  scope :disponiveis, -> { where(usado_por_id: nil) }

  def usado?
    usado_por_id.present?
  end

  def expirado?
    expira_em.present? && expira_em.past?
  end

  def valido_para_uso?
    !usado? && !expirado?
  end

  # resgate atomico: garante que dois alunos nao usem o mesmo codigo
  def resgatar!(usuario)
    with_lock do
      raise "Convite já utilizado" if usado?
      raise "Convite expirado" if expirado?
      update!(usado_por: usuario, usado_em: Time.current)
    end
  end

  private

  def gerar_codigo
    return if codigo.present?

    loop do
      candidato = "#{turma_sugerida.presence || 'SZ'}-#{SecureRandom.alphanumeric(4).upcase}"
      unless Convite.exists?(codigo: candidato)
        self.codigo = candidato
        break
      end
    end
  end
end
