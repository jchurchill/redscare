class RoundPlayController < GameClientWebsocketController

  def nominate
    user_id = message_data[:user_id] # user that was nominated
    nomination_id = message_data[:nomination_id] # nomination this applies to
    
    # TODO: validation that the current_user is round leader
    # TODO: validation that the nominee limit hasn't been reached
    # TODO: validation that the nominee hasn't already been added
    # TODO: validation that the nominee is a player in the game
    nomination = Nomination.find(nomination_id)
    user = User.find(user_id)
    nomination.nominees << user
    nomination.save!
    
    # Send back the new state
    game = Game.find(game_id)
    state = GameRoomStateProvider.new(game, current_user).get_state
    game_client.trigger :player_nominated, state, :namespace => 'game_room'

    nomination_transitioner = NominationTransitioner.new(nomination)
    if nomination_transitioner.can_transition_to_voting
      nomination_transitioner.to_voting_phase!
      game = Game.find(game_id)
      state = GameRoomStateProvider.new(game, current_user).get_state
      game_client.trigger :nomination_voting_phase, state, :namespace => 'game_room'
    end
  end

  def vote
    user_id = current_user.id # user that is voting
    nomination_id = message_data[:nomination_id] # nomination this applies to
    upvote = message_data[:upvote] # whether it was an upvote or downvote
    
    # TODO: validation that the voter is a player in the game
    # TODO: validation that the voter hasn't already voted
    nomination = Nomination.find(nomination_id)
    user = User.find(user_id)
    nomination.votes << NominationVote.new(user: user, upvote: upvote)
    nomination.save!

    # Send back the new state
    game = Game.find(game_id)
    state = GameRoomStateProvider.new(game, current_user).get_state
    game_client.trigger :player_voted, state, :namespace => 'game_room'
  end

end