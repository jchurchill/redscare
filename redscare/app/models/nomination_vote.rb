class NominationVote < ActiveRecord::Base

  # ===== Schema =====
  # :nomination (:nomination_id) => Nomination
  # :user (:user_id) => User
  # :upvote => boolean
  # :created_at => datetime
  # :updated_at => datetime

  belongs_to :nomination
  belongs_to :user
end
