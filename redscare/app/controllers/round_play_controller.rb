class RoundPlayController < GameClientWebsocketController

  def nominate
    game = GameReducer.dispatch(context_game, :nominate_player, {
      selecting_user_id: current_user.id,
      selected_user_id: message_data[:user_id]
    })[:state]

    # Send back the new entire game state, including new secrets
    state = GameRoomStateProvider.get_state(game, current_user)
    game_client.trigger :player_nominated, state, :namespace => 'game_room'

    # TODO: if conditions met, invoke other state changes and triggers
    # game_client.trigger :nomination_voting_phase, state, :namespace => 'game_room'
  end

  def vote
    game = GameReducer.dispatch(context_game, :cast_vote, {
      voting_user_id: current_user.id,
      upvote: message_data[:upvote]
    })[:state]

    # Send back the new state
    state = GameRoomStateProvider.get_state(game, current_user)
    game_client.trigger :player_voted, state, :namespace => 'game_room'
  end

end