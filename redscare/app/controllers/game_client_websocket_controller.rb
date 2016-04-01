class GameClientWebsocketController < WebsocketRails::BaseController
  def initialize_session
    # perform application setup here
  end

  protected
    def game_client
      WebsocketRails[:"game_room:#{game_id}"]
    end

    def game_id
      message[:game_id]
    end

    def message_data
      message[:message]
    end
end