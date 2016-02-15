class Game < ActiveRecord::Base
  enum state: {
    # Game is created and looking for players
    created: 1,
    # Game's players and roles finalized; rounds w/ nomination and missions occur; this is the majority of the game
    rounds_in_progress: 2,
    # Good guys have 3 passed missions, but assassin / seer are in the game, and assassin is making his decision on who to kill
    assassination: 3,
    # The game is over, and the outcome can be seen in the outcome property
    complete: 4,
    # The game ended before completion because it was cancelled for some reason (e.g., player left)
    cancelled: -1
  }

  enum outcome: {
    # Good guys get 3 passed missions (and seer is not killed)
    good_wins_normally: 1,
    # Bad guys get 3 failed missions
    evil_wins_normally: 2,
    # Good guys get 3 passed missions, but seer is killed by assassin
    evil_wins_from_assassination: 3,
    # A round's 5th nomination is rejected, causing the bad guys to instantly win
    evil_wins_from_nomination_failure: 4
  }

  belongs_to :creator, class_name: "User"
  belongs_to :assassinated_player, class_name: "User"

  has_many :players, -> { includes :user }, class_name: "GamePlayer"

  has_many :rounds, inverse_of: :game
end
