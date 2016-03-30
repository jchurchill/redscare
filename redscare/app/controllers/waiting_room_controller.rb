class WaitingRoomController < WebsocketRails::BaseController
  def initialize_session
    # perform application setup here
  end

  def join_room
    user_id = message_data[:user_id]
    
    game = Game.find(game_id)
    user = User.find(user_id)
    # TODO: validation to prevent race conditions
    game.players << GamePlayer.new(user: user)
    game.save!

    # Send back the new list of users
    game_players = game.players.map { |p| p.as_json({ include: :user, only: :user }) }
    game_client(game.id).trigger :player_joined, game_players, :namespace => 'game_room'
  end

  def leave_room
    user_id = message_data[:user_id]

    game = Game.find(game_id)
    # TODO: validation to prevent race conditions
    game.players.where(user_id: user_id).destroy_all

    # Send back the new list of users
    game_players = game.players.map { |p| p.as_json({ include: :user, only: :user }) }
    game_client(game.id).trigger :player_left, game_players, :namespace => 'game_room'
  end

  def start_game
    game = Game.find(game_id)
    # TODO: validation to prevent race conditions
    # TODO: validation that current user is game creator
    game.start!

    # Send back the new entire game state, including new secrets
    result = { secrets: game.secret_info(current_user.id), game: game.get_public_state }
    game_client(game.id).trigger :game_started, result, :namespace => 'game_room'
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