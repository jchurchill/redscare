class RoundPlayController < WebsocketRails::BaseController
  def initialize_session
    # perform application setup here
  end

  def nominate
    user_id = message_data[:user_id] # user that was nominated
    nomination_id = message_data[:nomination_id] # nomination this applies to
    
    # TODO: validation that this operation is okay
    nomination = Nomination.find(nomination_id)
    user = User.find(user_id)
    nomination.nominees << user
    nomination.save!
    
    # Send back the new game state
    game = Game.find(game_id).get_public_state
    game_client(game_id).trigger :player_nominated, game, :namespace => 'game_room'
  end

  def vote
    user_id = message_data[:user_id] # user that voted
    nomination_id = message_data[:nomination_id] # nomination this applies to
    upvote = message_data[:upvote] # whether it was an upvote or downvote
    
    # TODO: validation that this operation is okay
    nomination = Nomination.find(nomination_id)
    user = User.find(user_id)
    nomination.votes << NominationVote.new(user: user, upvote: upvote)
    nomination.save!

    # Send back the new game state
    game = Game.find(game_id).get_public_state
    game_client(game_id).trigger :player_voted, game, :namespace => 'game_room'
  end

  private
    def game_client (game_id)
      WebsocketRails[:"game_room:#{game_id}"]
    end

    def game_id
      message[:game_id]
    end

    def message_data
      message[:message]
    end

end