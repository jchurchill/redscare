module GameRoomEventHandler

  class EventChainer
    def initialize(&block)
      builder = EventChainBuilder.new
      block.call(builder)
      @callback_registrations = builder.callback_registrations
    end

    def handler(action_dispatcher)
      EventChainHandler.new action_dispatcher, @callback_registrations
    end

    # Provides builder syntax for setting up all the event callbacks
    class EventChainBuilder
      def initialize
        @callback_registrations = {}
      end
      # handler expected to accept (dispatcher, game)
      def callback(event, &handler)
        e_sym = event.to_sym
        @callback_registrations[e_sym] ||= []
        @callback_registrations[e_sym] << handler
        return self
      end
      attr_reader :callback_registrations
    end
  end

  # Dispatches actions and invokes their configured callbacks (if any)
  class EventChainHandler
    def initialize(action_dispatcher, callback_registrations)
      @action_dispatcher = action_dispatcher
      @callback_registrations = callback_registrations
    end

    def fire(action, data = nil)
      dispatch_result = @action_dispatcher.dispatch(action, data)
      
      if dispatch_result[:success]
        (@callback_registrations[action.to_sym] || []).each do |callback|
          callback.call(self, dispatch_result[:state])
        end
      end
    end
  end

  @@event_chainer = EventChainer.new do |builder|
    
    # Whenever any of the following events are fired, try taking the action(s) in its corresponding list.
    # It will simply do nothing if it is not a valid transition.
    # This is just a nice way to not have to repeat a lot of the logic already in the game_reducer
    # that understands when certain transitions are valid.

    {
      :start => [
        :new_round # always
      ],
      :new_round => [
        :new_nomination # always
      ],
      :nominate_player => [
        :start_voting 
      ],
      :cast_vote => [
        :complete_nomination # upon last vote
      ],
      :complete_nomination => [
        :start_mission, # upon successful nomination
        :new_nomination, # upon failed nomination (but not final one)
        :complete_round # upon failed nomination (final one)
      ],
      :mission_submit => [
        :complete_round # upon final submission
      ],
      :complete_round => [
        :new_round, # upon non-game-ending round completion
        :begin_assassination, # upon good team win, in game with seer/assassin
        :complete_game # evil team wins, good team wins with no seer in game
      ],
      :select_assassin_target => [
        :complete_game # always
      ]
    }.each do |action, next_actions|
      next_actions.each do |next_action|
        builder.callback(action) { |dispatcher, game| dispatcher.fire(next_action) }
      end
    end
  end

  # Gets an event handler for the game with the provided game_id
  def self.for_game(game_id)
    action_dispatcher = GameActionDispatcher.new game_id
    return @@event_chainer.handler action_dispatcher
  end

end