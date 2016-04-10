class GameRoomEventHandler

  def self.handle(incoming_event, message, current_user)
    # message expected to have :game_id and :message properties
    # because it is a message from the game room client
    dispatcher = GameActionDispatcher.new message[:game_id]
    handler = GameRoomEventHandler.new dispatcher, message[:message], current_user
    handler.send(incoming_event.to_sym)

    results = handler.event_results
    # success = "was game updated in any way"
    success = results.any? { |r| r[:success] }
    # game = final state of game after (possible) chain of updates
    game = results.reverse.first[:game]
    return { success: success, game: game }
  end

  def self.supported_events
    self.public_instance_methods false
  end

  def event_results
    @results
  end

  def initialize (action_dispatcher, event_data, current_user)
    @dispatcher = action_dispatcher
    @event_data = event_data
    @current_user = current_user
    @results = []
  end

  def join_room
    dispatch :player_join, { user_id: current_user.id }
  end

  def leave_room
    dispatch :player_leave, { user_id: current_user.id }
  end

  def start_game
    dispatch :start
    dispatch :new_round
    dispatch :new_nomination
  end

  def nominate
    result = dispatch :nominate_player, {
      selecting_user_id: current_user.id,
      selected_user_id: event_data[:user_id]
    }

    nomination = result[:game].try(:current_round).try(:current_nomination)
    if not nomination.nil? and nomination.nominees.count == nomination.required_nominee_count
      dispatch :start_voting
    end
  end

  private
    def dispatch(action, data = nil)
      dispatch_result = @dispatcher.dispatch(action, data)
      result = { action: action, success: dispatch_result[:success], game: dispatch_result[:state] }
      @results << result
      return result
    end

    def event_data
      @event_data
    end

    def current_user
      @current_user
    end
end