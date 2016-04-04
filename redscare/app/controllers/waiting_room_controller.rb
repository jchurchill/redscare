class WaitingRoomController < GameClientWebsocketController

  def join_room
    game = GameReducer.dispatch(context_game, :player_join, {
      user_id: message_data[:user_id]
    })[:state]

    # Send back the new state
    state = GameRoomStateProvider.get_state(game, current_user)
    game_client.trigger :player_joined, state, :namespace => 'game_room'
  end

  def leave_room
    game = GameReducer.dispatch(context_game, :player_leave, {
      user_id: message_data[:user_id]
    })[:state]

    # Send back the new state
    state = GameRoomStateProvider.get_state(game, current_user)
    game_client.trigger :player_left, state, :namespace => 'game_room'
  end

  def start_game
    game = GameReducer.dispatch(context_game, :start)[:state]
    game = GameReducer.dispatch(game, :new_round)[:state]
    game = GameReducer.dispatch(game, :new_nomination)[:state]

    # Send back the new state
    state = GameRoomStateProvider.get_state(game, current_user)
    game_client.trigger :game_started, state, :namespace => 'game_room'
  end

end