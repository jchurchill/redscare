class Nomination < ActiveRecord::Base
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
  has_many :nominees, through: :nominees, source: :user
  has_many :votes, class_name: "NominationVote"
end
