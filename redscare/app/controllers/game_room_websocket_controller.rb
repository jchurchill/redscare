class GameRoomWebsocketController < WebsocketRails::BaseController
  def initialize_session
    # Anything here persists for the lifetime of the server
    # Can setup controller_store (controller-based, session-based hash storage) and data_store (controller-based hash storage)
  end

  def self.supported_events
    self.public_instance_methods false
  end

  # Takes actions that players can take to modify game state during game play,
  # and wires them up as invocations on the game room event handler
  # (which subsequently handles chained events and post-update information broadcasting)

  def join_room
    dispatch :player_join, { user_id: current_user.id }
  end

  def leave_room
    dispatch :player_leave, { user_id: current_user.id }
  end

  def start_game
    dispatch :start
  end

  def nominate
    dispatch :nominate_player, {
      selecting_user_id: current_user.id,
      selected_user_id: event_data[:user_id]
    }
  end

  def vote
    dispatch :cast_vote, {
      voting_user_id: current_user.id,
      upvote: event_data[:upvote]
    }
  end

  def mission_submit
    dispatch :mission_submit, {
      submitting_user_id: current_user.id,
      pass: event_data[:pass]
    }
  end

  def select_assassin_target
    dispatch :select_assassin_target, {
      selecting_user_id: current_user.id,
      target_user_id: event_data[:target_user_id]
    }
  end

  private
    def event_data
      message[:message]
    end

    def dispatch(action, data = nil)
      game_id = message[:game_id]
      GameRoomEventHandler.for_game(game_id).fire(action, data)
    end
end