class Round < ActiveRecord::Base
  enum state: {
    # Nomination + voting phases are occurring to decide who goes on the mission
    nomination: 1,
    # The nominees for the mission have been accepted and the mission is now occurring
    mission: 2,
    # The round is over because operatives went on the mission and it succeeded or failed
    complete: 3
  }

  enum outcome: {
    # There were not enough failures present in the mission outcome to cause a failure
    success: 1,
    # Enough failures were present in the mission outcome that the round failed
    failure: 2,
    # The 5th nomination was not accepted (leads to game over)
    out_of_nominations: 3
  }

  belongs_to :game, inverse_of: :rounds
  has_many :operatives, class_name: "RoundOperative", inverse_of: :round
end
