class Hashtag < ApplicationRecord
  self.table_name = "hashtags"
  has_many :hashtags_posts, class_name: "HashtagPost", foreign_key: :hashtag_id, dependent: :destroy
  has_many :posts, through: :hashtags_posts, source: :post

  validates :nome, presence: true, uniqueness: true

  def self.registrar!(texto, post:)
    return [] if texto.blank?
    tags = texto.scan(/#([A-Za-zÀ-ÿ0-9_]{2,30})/).flatten.map(&:downcase).uniq
    tags.map do |t|
      h = find_or_create_by!(nome: t)
      HashtagPost.find_or_create_by!(hashtag: h, post: post)
      h.increment!(:usos)
      h
    end
  end

  def self.em_alta(limite = 8)
    order(usos: :desc).limit(limite)
  end
end
