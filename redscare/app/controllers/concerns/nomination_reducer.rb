module NominationReducer
  @@reducer = StateReducer.new self do |r|

    r.delegate :nominate_player # add player to set of nominees
    r.delegate :start_voting # state: "selecting" => "voting"
    r.delegate :cast_vote # add vote to list of nomination votes
    r.delegate :complete_nomination # state: "voting" => "complete", outcome is set

  end

  class << self
    def dispatch (nomination, action, data = nil)
      @@reducer.dispatch nomination, action, (data || {})
    end

    # data: { selecting_user_id, selected_user_id }
    def nominate_player (nomination, action, data)
      # Only allow if...
      return false if not (
        # state is "selecting"
        (nomination.selecting?) and
        # selecting user is the nomination leader
        (nomination.leader_id == data[:selecting_user_id]) and
        # nominee not already selected
        (not nomination.nominees.any? { |n| n.id == data[:selected_user_id] }) and
        # required nominee count not yet achieved
        (nomination.nominees.count < nomination.required_nominee_count) and
        # nominee is a player in the game
        (nomination.round.game.players.any? { |p| p.user_id == data[:selected_user_id] })
      )

      nomination.nominees << User.find(data[:selected_user_id])
      nomination.save!
      return true
    end

    # data: { }
    def start_voting (nomination, action, data)
      # Only allow if...
      return false if not (
        # state is "selecting"
        (nomination.selecting?) and
        # required nominee count reached
        (nominees.count == nomination.required_nominee_count)
      )

      nomination.voting!
      nomination.save!
      return true
    end

    # data: { voting_user_id, upvote }
    def cast_vote (nomination, action, data)
      # Only allow if...
      return false if not (
        # state is "voting"
        (nomination.voting?) and
        # vote not already cast for this user
        (not nomination.votes.any? { |v| v.user_id == data[:voting_user_id] }) and
        # voter is a player in the game
        (nomination.round.game.players.any? { |p| p.user_id == data[:voting_user_id] })
      )

      nomination.votes << NominationVote.new(user_id: data[:voting_user_id], upvote: data[:upvote])
      nomination.save!
      return true
    end

    # data: { }
    def complete_nomination (nomination, action, data)
      # Only allow if...
      return false if not (
        # state is "voting"
        (nomination.voting?) and
        # required vote count is reached
        (nomination.votes.count == nomination.round.game.player_count)
      )

      # Set the outcome of the nomination
      strict_majority_upvote = (nomination.votes.count { |v| v.upvote }) > (nomination.votes.count / 2)
      if strict_majority_upvote
        nomination.accepted!
      else
        nomination.rejected!
      end

      nomination.complete!
      nomination.save!
      return true
    end
  end
end