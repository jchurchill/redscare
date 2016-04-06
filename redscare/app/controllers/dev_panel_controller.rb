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
      if user.nil?
        respond(false)
      end

      success = GameRoomEventHandler.handle(event, message, user)

    rescue StandardError
      respond(false)
      raise
    end

    respond(success)
  end

  private
    def respond(success)
      respond_to do |format|
        format.json { render json: { :success => success } }
      end
    end
end