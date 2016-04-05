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
    dispatch :player_join, event_data
  end

  def leave_room
    dispatch :player_leave, event_data
  end

  def start_game
    dispatch :start
    dispatch :new_round
    dispatch :new_nomination
  end

  def nominate
    dispatch :nominate_player, {
      selecting_user_id: current_user.id,
      selected_user_id: event_data[:user_id]
    }
  end

  private
    def dispatch(action, data)
      @dispatcher.dispatch(action, data)
    end

    def event_data
      @event_data
    end

    def current_user
      @current_user
    end
end