class GameRoomEventHandler

  def self.handle(incoming_event, message, current_user)
    # message expected to have :game_id and :message properties
    # because it is a message from the game room client
    dispatcher = GameActionDispatcher.new message[:game_id], current_user
    handler = GameRoomEventHandler.new dispatcher, message[:message], current_user
    handler.send(incoming_event.to_sym)
  end

  def self.supported_events
    self.public_instance_methods false
  end

  def initialize (action_dispatcher, event_data, current_user)
    @dispatcher = action_dispatcher
    @event_data = event_data
    @current_user = current_user
  end

  def join_room
    result = dispatch :player_join, { user_id: current_user.id }
    return result[:success]
  end

  def leave_room
    result = dispatch :player_leave, { user_id: current_user.id }
    return result[:success]
  end

  def start_game
    results = []
    results << (dispatch :start)
    results << (dispatch :new_round)
    results << (dispatch :new_nomination)
    return results.any? { |r| r[:success] }
  end

  def nominate
    result = dispatch :nominate_player, {
      selecting_user_id: current_user.id,
      selected_user_id: event_data[:user_id]
    }
    return result[:success]
  end

  private
    def dispatch(action, data = nil)
      @dispatcher.dispatch(action, data)
    end

    def event_data
      @event_data
    end

    def current_user
      @current_user
    end
end