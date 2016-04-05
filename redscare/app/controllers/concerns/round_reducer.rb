module RoundReducer
  @@reducer = StateReducer.new self do |r|

    r.delegate :new_nomination # initialization; state = "mission", leader is assigned
    r.delegate :start_mission # state: "nomination" => "mission"
    r.delegate :mission_submit # operative on mission submits a pass or a fail
    r.delegate :complete_mission # state: "mission" => "complete", outcome is set

    # Delegate nomination actions to the round reducer
    r.delegate [
      # Nomination actions
      :nominate_player, # add player to set of nominees
      :start_voting, # state: "selecting" => "voting"
      :cast_vote, # add vote to list of nomination votes
      :complete_nomination # state: "voting" => "complete", outcome is set
    ], :nomination_reduce
  end

  class << self
    def dispatch (round, action, data = nil)
      @@reducer.dispatch round, action, (data || {})
    end

    # data: { }
    def new_nomination (round, action, data)
      current_nomination = round.current_nomination
      # Only allow if...
      return false if not (
        # round is still in "nomination" state
        (round.nomination?) and
        # this is the first nomination being created in the round, or..
        (current_nomination.nil? or (
            # the last nomination's outcome was rejected
            (current_nomination.rejected?) and
            # current nomination is not the 5th nomination
            (not current_nomination.is_final_nomination)
          )
        )
      )

      # Determine the leader of this new nomination
      current_leader_id = round.game.current_leader_id
      if current_leader_id.nil?
        # Determine the very first leader of the game randomly
        next_leader_id = round.game.players[rand(round.game.player_count)].user_id
      else
        # Determine next leader. The ordering of leadership transfer is given by the ordering of game players
        player_ids = round.game.players.sort_by { |p| p.id }.map { |p| p.user_id }.to_a
        current_leader_index = player_ids.find_index { |p_id| p_id == current_leader_id }
        next_leader_id = player_ids[(current_leader_index + 1) % player_ids.count]
      end

      # Determine the next nomination number
      next_nomination_number = if current_nomination.nil? then 1 else current_nomination.nomination_number + 1 end

      round.nominations << Nomination.new(
        leader_id: next_leader_id,
        nomination_number: next_nomination_number,
        state: Nomination.states[:selecting]
      )
      round.save!
      return true
    end

    # data: { }
    def start_mission (round, action, data)
      current_nomination = round.current_nomination
      # Only allow if...
      return false if not (
        # round is still in "nomination" state
        (round.nomination?) and
        # current nomination is complete
        (current_nomination.complete?) and
        # the last nomination's outcome was accepted
        (current_nomination.accepted?)
      )

      # Set round operatives to be the selected nominees from the last nomination
      round.operatives = current_nomination.nominees.map { |user| RoundOperative.new(operative: user) }

      round.mission!
      round.save!
      return true
    end

    # data: { submitting_user_id, pass }
    def mission_submit (round, action, data)
      round_operative = round.operatives.find { |o| o.user_id == data[:submitting_user_id] }
      # Only allow if...
      return false if not (
        # round is in "mission" state
        (round.mission?) and
        # submitting user is an operative on the mission
        (not round_operative.nil?) and
        # submitting user has not already cast their submission
        (not round_operative.submitted?)
      )

      round_operative.pass = data[:pass]
      round_operative.save!
      return true
    end

    # data: { }
    def complete_mission (round, action, data)
      current_nomination = round.current_nomination
      # Only allow if...
      return false if not (
        # round is still in "mission" state
        (round.mission?) and
        # one of the following conditions are met:
        (
          # round operatives have all submitted
          (round.operatives.all? { |o| o.submitted? }) or
          # current nomination is 5 and was rejected
          (current_nomination.is_final_nomination and current_nomination.rejected?)
        )
      )

      # Determine round outcome.
      if round.current_nomination.rejected?
        round.out_of_nominations!
      elsif round.operatives.where(pass: false).count >= round.fails_required_for_failure
        round.failure!
      else
        round.success!
      end

      round.save!
      return true
    end

    def nomination_reduce (round, action, data)
      result = NominationReducer.dispatch round.current_nomination, action, data
      return result[:success]
    end
  end
end