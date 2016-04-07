class DevPanelController < ApplicationController

  protect_from_forgery :except => [:game_action]

  def index
    @props = { :gameActionPath => devpanel_game_action_path }
  end

  def game_action
    begin

      user = User.find(params[:userId])

      result = GameActionDispatcher.new(params[:gameId], user).dispatch(params[:gameAction].to_sym, params[:data])
      
      respond({ success: result[:success], gameState: result[:state].as_state })

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