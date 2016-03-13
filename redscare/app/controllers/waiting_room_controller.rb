class WaitingRoomController < WebsocketRails::BaseController
  def initialize_session
    # perform application setup here
  end

  def join_room
    broadcast_message :player_joined, { }
  end

  def leave_room
    broadcast_message :player_left, { }
  end

  def start_game
    broadcast_message :game_started, { }
  end

end