class Nomination < ActiveRecord::Base

  # ===== Schema =====
  # :round (:round_id) => Round
  # :leader (:leader_id) => User
  # :nomination_number => int
  # :state => int (Nomination.states)
  # :outcome => int (nil) (Nomination.outcomes)
  # :created_at => datetime
  # :updated_at => datetime
  # :nominees => collection of User
  # :votes => collection of NominationVote

  enum state: {
    # The nomination has just begun, but nominees have not yet been selected
    selecting: 1,
    # The nominees were selected, and are currently being voted on
    voting: 2,
    # The nomination is over because voting has occurred and the outcome recorded
    complete: 3
  }

  enum outcome: {
    # A majority of players upvoted the nomination, so it was accepted
    accepted: 1,
    # A majority of players did not upvote the nomination, so it was rejected
    rejected: 2
  }

  belongs_to :round, inverse_of: :nominations
  belongs_to :leader, class_name: "User"
  has_and_belongs_to_many :nominees, class_name: "User"
  has_many :votes, class_name: "NominationVote"

  def required_nominee_count
    round.operatives_required
  end

  def is_final_nomination?
    nomination_number == 5
  end

  def as_state
    state = as_json(only: [:id, :leader_id, :nomination_number, :state, :outcome])
    # Only include the id of the nominee
    state[:nominees] = nominees.map { |n| n.id }
    state[:votes] = votes.map { |v| v.as_state }
    return state
  end
end
