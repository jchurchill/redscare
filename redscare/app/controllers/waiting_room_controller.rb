class WaitingRoomController < WebsocketRails::BaseController
  def initialize_session
    # perform application setup here
  end

  def join_room
    game = Game.find(message[:game_id])
    user = User.find(message[:user_id])
    game.players << GamePlayer.new(user: user)
    game.save!

    game_players = game.players.map { |p| p.as_json({ include: :user, only: :user }) }
    p :"game_#{game.id}"
    WebsocketRails[:"game_#{game.id}"].trigger :player_joined, game_players, :namespace => 'game_room'
  end

  def leave_room
    game = Game.find(message[:game_id])
    game.players.where(user_id: message[:user_id]).destroy_all

    game_players = game.players.map { |p| p.as_json({ include: :user, only: :user }) }
    p :"game_#{game.id}"
    WebsocketRails[:"game_#{game.id}"].trigger :player_left, game_players, :namespace => 'game_room'
  end

  def start_game
    #broadcast_message :game_started, { }
  end

end