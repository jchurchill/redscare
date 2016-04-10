  # %%%%% The game state machine %%%%%

  # When game state = "created"
  #   * A player joins
  #   * A player leaves
  #   * All players present and the game is requested to begin => game progresses to "round_in_progress" phase
  # When game state = "rounds_in_progress"
  #   * A new round is started
  #   * A new nomination is started and the leader is chosen randomly
  #   When round state = nominating
  #     When nomination state = selecting
  #       * A player is selected as nominee
  #       * The nomination progresses to "voting" phase after all nominees selected
  #     When nomination state = voting
  #       * A player votes regarding the proposed nomination
  #       * All votes cast, and there is a majority voting up => nomination progresses to "complete" and outcome is "accepted"
  #       * All votes cast, and there is not a majority voting up => nomination progresses to "complete" and outcome is "rejected"
  #     When nomination state = complete
  #       * The nomination was rejected and it was not the 5th nomination => A new nomination is started
  #       * The nomination was rejected and it was the 5th nomination =>
  #           The round progresses to "complete" and the outcome is "out_of_nominations",
  #           and the game progresses to "complete" and the outcome is "evil_wins_from_nomination_failure"
  #       * The nomination was accepted => The round progresses to "mission" phase and the round operatives are set as the nominees
  #   When round state = mission
  #     * A submission is cast by an operative on a mission
  #     * All submissions cast and fail count >= required fails => the round progresses to "complete" and the outcome is "failure"
  #     * All submissions cast and fail count < required fails => the round progresses to "complete" and the outcome is "success"
  #   When round state = complete
  #     * No team has 3 missions yet => a new round is started
  #     * The good team has won 3 missions, and the assassin is in the game => the game progresses to "assassination" phase
  #     * The good team has won 3 missions => the game progresses to "complete" and the outcome is "good_wins_normally"
  #     * The evil team has won 3 missions => the game progresses to "complete" and the outcome is "evil_wins_normally"
  # When game state = "assassination"
  #   * The assassin chooses his target
  #   * Target was seer => the game progresses to "complete" and the outcome is "evil_wins_from_assassination"
  #   * Target was not seer => the game progresses to "complete" and the outcome is "good_wins_normally"
  # When game state = "complete"
  #   This is the final state and no more state transitions may occur.

module GameReducer
  @@reducer = StateReducer.new self do |r|

    r.delegate :player_join # Player joins the game
    r.delegate :player_leave # Player leaves the game
    r.delegate :start # state: "created" => "rounds_in_progress", set of players locked in, roles are assigned
    r.delegate :new_round # The next round is created

    # Delegate round or nomination actions to the round reducer
    r.delegate [
      # Round actions
      :new_nomination, # initialization; state = "mission", leader is assigned
      :start_mission, # state: "nomination" => "mission"
      :mission_submit, # modify "pass" on round_operative
      :complete_mission, # state: "mission" => "complete", outcome is set
      # Nomination actions
      :nominate_player, # add player to set of nominees
      :start_voting, # state: "selecting" => "voting"
      :cast_vote, # add vote to list of nomination votes
      :complete_nomination # state: "voting" => "complete", outcome is set
    ], :round_reduce

    r.delegate :begin_assassination # state: "mission" => "assassination"
    r.delegate :select_assassin_target # assassinated player is chosen

    r.delegate :complete_game # state: "mission" or "assassination" => "complete"
  end

  class << self
    def dispatch (game, action, data = nil)
      @@reducer.dispatch game, action, (data || { })
    end

    # data: { user_id }
    def player_join (game, action, data)
      players = game.players
      # Only allow if...
      return false if not (
        # user_id provided
        (not data[:user_id].nil?) and
        # game is in "created" state
        (game.created?) and
        # the player has not joined
        not (players.any? { |p| p.user_id == data[:user_id] }) and
        # the game does not yet have the required number of players
        (players.count < game.player_count)
      )

      game.players << GamePlayer.new(user_id: data[:user_id])
      game.save!
      return true
    end

    # data: { user_id }
    def player_leave (game, action, data)
      # Only allow if...
      return false if not (
        # user_id provided
        (not data[:user_id].nil?) and
        # game is in "created" state
        (game.created?) and
        # the player leaving is not the creator
        (data[:user_id] != game.creator_id)
      )

      to_destroy = GamePlayer.find_by(game_id: game.id, user_id: data[:user_id])
      game.players.destroy(to_destroy) if not to_destroy.nil?
      game.save!
      return true
    end

    # data: { }
    def start (game, action, data)
      # Only allow if...
      return false if not (
        # game is in "created" state
        (game.created?) and
        # the game has the required number of players
        (game.players.count == game.player_count)
      )

      # Get the derived role set for this game
      role_set = []
      assigned_evil_roles = 0
      if game.includes_seer
        role_set << GamePlayer.roles[:seer] << GamePlayer.roles[:assassin]
        assigned_evil_roles += 1
      end
      if game.includes_seer_deception
        role_set << GamePlayer.roles[:seer_knower] << GamePlayer.roles[:false_seer]
        assigned_evil_roles += 1
      end
      if game.includes_rogue_evil
        role_set << GamePlayer.roles[:rogue_evil]
        assigned_evil_roles += 1
      end
      if game.includes_evil_master
        role_set << GamePlayer.roles[:evil_master]
        assigned_evil_roles += 1
      end

      # Add any extra normal evils until we've reached the required evil role count
      total_evil_role_count = GameRules.evil_role_count game.player_count
      remaining_evil_roles = total_evil_role_count - assigned_evil_roles
      if remaining_evil_roles < 0
        raise "Unexpected: more special evil roles included than the game has capacity for"
      end
      remaining_evil_roles.times {
        role_set << GamePlayer.roles[:evil_normal]
      }

      # Add any extra normal goods until we've reached the required total role count
      (game.player_count - role_set.count).times {
        role_set << GamePlayer.roles[:good_normal] 
      }

      # Shuffle the list and zip with the players, assigning each his role
      # because the shuffle randomizes order, the role assignment is random
      role_set.shuffle!
      game.players.zip(role_set) { |player, role| player.update! role: role }

      # state is now in progress
      game.rounds_in_progress!
      game.save!
      return true
    end

    # data: { }
    def new_round (game, action, data)
      current_round = game.current_round
      # Only allow if...
      return false if not (
        # game is still in "rounds_in_progress" state
        (game.rounds_in_progress?) and
        (
          # this is the first round being created in the game
          (current_round.nil?) or
          (
            # the last round's outcome was decided
            (current_round.outcome_decided?) and
            # the last round's state is complete
            (current_round.complete?) and
            # the last round's outcome was not "out_of_nominations" (would mean game over)
            (not current_round.out_of_nominations?) and
            # across previous rounds, 3 successes or 3 failures are not present (would mean game over)
            (game.succeeded_rounds.count < 3 and game.failed_rounds.count < 3)
          )
        )
      )

      next_round_number = if current_round.nil? then 1 else current_round.round_number + 1 end

      game.rounds << Round.new(
        round_number: next_round_number,
        state: Round.states[:nomination]
      )
      game.save!
      return true
    end

    # data: { }
    def begin_assassination (game, action, data)
      current_round = game.current_round
      # Only allow if...
      return false if not (
        # game is still in "rounds_in_progress" state
        (game.rounds_in_progress?) and
        # game has assassin/seer roles
        (game.includes_seer) and
        # across previous rounds, 3 successes are present
        (game.succeeded_rounds.count == 3)
      )

      game.assassination!
      game.save!
      return true
    end

    # data: { selecting_user_id, target_user_id }
    def select_assassin_target (game, action, data)
      # Only allow if...
      return false if not (
        # game is in "assassination" state
        (game.assassination?) and
        # target not already selected
        (game.assassinated_player_id.nil?) and
        # target is a good player in the game
        (game.players.any? { |p| p.user_id == data[:target_user_id] and p.is_good? }) and
        # selecting user is the assassin
        (game.players.any? { |p| p.assassin? and p.user_id == data[:selecting_user_id] })
      )

      game.assassinated_player_id = data[:target_user_id]
      game.save!
      return true
    end

    # data: { }
    def complete_game (game, action, data)
      # Only allow if...
      return false if not (
        (
          # game is in "assassination" state
          (game.assassination?) and
          # and assassinated player has selected target
          (not game.assassinated_player_id.nil?)
        ) or
        # or...
        (
          # game is in "rounds_in_progress" state
          (game.rounds_in_progress?) and
          # and the following game-over conditions are met:
          (
            # the last round's outcome was "out_of_nominations"
            (game.current_round.out_of_nominations?) or
            # or, 3 successful rounds are present and we're not supposed to go to the assassination phase
            (game.succeeded_rounds.count == 3 and not game.includes_seer) or
            # or, 3 failed rounds are present
            (game.failed_rounds.count == 3)
          )
        )
      )

      if game.current_round.out_of_nominations?
        game.evil_wins_from_nomination_failure!
      elsif game.seer_was_assassinated?
        game.evil_wins_from_assassination!
      elsif game.failed_rounds.count == 3
        game.evil_wins_normally!
      elsif game.succeeded_rounds.count == 3
        game.good_wins_normally!
      end

      game.complete!
          
      game.save!
      return true
    end

    def round_reduce (game, action, data)
      round = game.current_round
      return false if round.nil?
      result = RoundReducer.dispatch game.current_round, action, data
      return result[:success]
    end
  end
end