class WaitingRoomController < GameClientWebsocketController

  def join_room
    user_id = message_data[:user_id]
    
    game = Game.find(game_id)
    user = User.find(user_id)
    # TODO: validation to prevent race conditions
    game.players << GamePlayer.new(user: user)
    game.save!

    # Send back the new list of users
    game_players = game.players.map { |p| p.as_state }
    game_client.trigger :player_joined, game_players, :namespace => 'game_room'
  end

  def leave_room
    user_id = message_data[:user_id]

    game = Game.find(game_id)
    # TODO: validation to prevent race conditions
    game.players.where(user_id: user_id).destroy_all

    # Send back the new list of users
    game_players = game.players.map { |p| p.as_state }
    game_client.trigger :player_left, game_players, :namespace => 'game_room'
  end

  def start_game
    game = Game.find(game_id)
    # TODO: validation to prevent race conditions
    # TODO: validation that current user is game creator
    GameStarter.new(game).start!

    # Send back the new entire game state, including new secrets
    state = GameRoomStateProvider.new(game, current_user).get_state
    game_client.trigger :game_started, result, :namespace => 'game_room'
  end

end