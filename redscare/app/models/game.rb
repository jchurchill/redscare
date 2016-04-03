class Game < ActiveRecord::Base

  # ===== Schema =====
  # :name => string
  # :player_count => int
  # :creator (:creator_id) => User
  # :includes_seer => boolean
  # :includes_seer_deception => boolean
  # :includes_evil_master => boolean
  # :includes_rogue_evil => boolean
  # :state => int (Game.states)
  # :outcome => int (nil) (Game.outcomes)
  # :assassinated_player (:assassinated_player_id) => User (nil)
  # :created_at => datetime
  # :updated_at => datetime
  # :players => collection of GamePlayer
  # :rounds => collection of Round

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

  def current_round
    rounds.max_by { |r| r.round_number }
  end

  def is_in_game? (user_id)
    return players.any? { |player| player.user_id = user_id }
  end

  def as_state
    state = as_json(only: [
      :id, :name, :player_count, :creator_id,
      :includes_seer, :includes_seer_deception, :includes_rogue_evil, :includes_evil_master,
      :state, :outcome,
      :assassinated_player_id
    ])
    state[:players] = players.map { |p| p.as_state }
    state[:rounds] = rounds.map { |r| r.as_state }
    return state
  end
end
