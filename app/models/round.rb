class Round < ActiveRecord::Base

  # ===== Schema =====
  # :game (:game_id) => Game
  # :round_number => int
  # :state => int (Round.states)
  # :outcome => int (nil) (Round.outcomes)
  # :created_at => datetime
  # :updated_at => datetime
  # :operatives => collection of RoundOperative
  # :nominations => collection of Nomination

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
  has_many :nominations, inverse_of: :round

  def current_nomination
    nominations.max_by { |n| n.nomination_number }
  end

  def operatives_required
    mission_info[:operative_count]
  end

  def fails_required_for_failure
    mission_info[:required_fail_count]
  end

  def mission_info
    GameRules.round_mission_properties(game.player_count, round_number)
  end

  def current_leader_id
    if not current_nomination.nil? then current_nomination.leader_id else nil end
  end

  def outcome_decided?
    not outcome.nil?
  end

  def fail_count
    return nil if not outcome_decided?
    operatives.where(pass: false).count
  end

  def as_state
    state = as_json({ only: [:id, :round_number, :state, :outcome, :fail_count], methods: [:fail_count] })
    state[:operatives] = operatives.map { |o| o.as_state }
    state[:nominations] = nominations.map { |n| n.as_state }
    return state
  end
end
