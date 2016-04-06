class DevPanelController < ApplicationController

  protect_from_forgery :except => [:game_action]

  def index
    @props = { :gameActionPath => devpanel_game_action_path }
  end

  def game_action
    begin

      event = params[:gameEvent]
      message = {
        :game_id => params[:gameId],
        :message => params[:data]
      }
      user = User.find(params[:userId])

      result = GameRoomEventHandler.handle(event, message, user)
      respond({ success: result[:success] })

    rescue StandardError
      respond({ success: false })
      raise
    end
  end

  private
    def respond(data)
      respond_to do |format|
        format.json { render json: data }
      end
    end
end