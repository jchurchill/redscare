class GameRoomWebsocketController < WebsocketRails::BaseController
  def initialize_session
    # Anything here persists for the lifetime of the server
    # Can setup controller_store (controller-based, session-based hash storage) and data_store (controller-based hash storage)
  end

  def self.supported_events
    GameRoomEventHandler.supported_events
  end

  def handle
    GameRoomEventHandler.handle event.name, message, current_user
  end
end