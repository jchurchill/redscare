class DevPanelController < ApplicationController

  def index
    @props = {
      :gameActionPath => devpanel_game_action_path,
      :createUserPath => devpanel_create_user_path
    }
  end

  def create_user
    new_user = User.new({ email: params[:email], password: params[:password], password_confirmation: params[:password] })
    success = new_user.save
    respond({ success: success, errors: new_user.errors })
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