class GamesController < ApplicationController
  # All methods on this controller require logged-in user;
  # if hitting otherwise, redirect to login page
  before_filter :authenticate_user!

  def index
    @game_index_props = { 
      :chatPath => chat_path,
      :newGamePath => new_game_path,
      :games => Game.all.map { |g| {
        :id => g.id,
        :title => g.name,
        :creator => g.creator.email,
        :created_at => g.created_at,
        :path => url_for(g)
        } }
    }
  end

  def show
    # TODO: remove private information
    game = Game.find(params[:id]);
    game_info = game.get_public_state

    @game_room_props = {
      :component_props => {
        :links => {
          :games => games_path,
          :host => request.host_with_port
        }
      },
      :store_props => {
        :user => current_user,
        :game => game_info
      }
    }
  end

  def new
    @game_creator_props = {
      :createPath => games_path,
      :authenticity => { :name => request_forgery_protection_token.to_s, :value => form_authenticity_token }
    }
  end

  def create
    game_params = 
      params.permit(
        :name,
        :player_count,
        :includes_seer,
        :includes_seer_deception,
        :includes_evil_master,
        :includes_rogue_evil)
      .merge({
        :creator => current_user,
        :state => Game.states[:created],
        :players => [GamePlayer.new(user: current_user)]
      })

    game = Game.new(game_params)
    game.save!

    redirect_to game
  end
end
