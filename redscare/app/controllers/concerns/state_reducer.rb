class StateReducer
  def initialize(context, &block)
    builder = StateReducerBuilder.new
    block.call(builder)
    @registrations = builder.action_registrations
    @context = context
  end

  def dispatch(state, action, data)
    action_sym = action.to_sym
    handler = @registrations[action_sym]
    if not handler.nil?
      success = @context.send(handler, state, action_sym, data)
    else
      success = false
    end
    return { state: state, success: success }
  end

  class StateReducerBuilder
    def initialize
      @action_registrations = {}
    end
    def delegate(action, handler = nil)
      actions = (if action.respond_to?(:each) then action else [action] end)
      actions.each { |a|
        a_sym = a.to_sym
        @action_registrations[a_sym] = (handler || a).to_sym
      }
      return
    end
    attr_reader :action_registrations
  end
end
