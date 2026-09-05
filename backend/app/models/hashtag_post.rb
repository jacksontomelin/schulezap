class HashtagPost < ApplicationRecord
  self.table_name = "hashtags_posts"
  belongs_to :hashtag
  belongs_to :post
end
