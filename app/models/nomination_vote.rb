class NominationVote < ActiveRecord::Base

  # ===== Schema =====
  # :nomination (:nomination_id) => Nomination
  # :user (:user_id) => User
  # :upvote => boolean
  # :created_at => datetime
  # :updated_at => datetime

  belongs_to :nomination
  belongs_to :user

  def as_state
    # Only include vote status when the nomination is complete
    # Otherwise, it's useful to return the fact that a vote did happen
    only = [:id, :user_id]
    if nomination.complete?
      only << :upvote
    end
    as_json(only: only)
  end
end
