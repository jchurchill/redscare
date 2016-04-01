class GamesController < ApplicationController
  # All methods on this controller require logged-in user;
  # if hitting otherwise, redirect to login page
  before_filter :authenticate_user!

  def index
    user_id = current_user.id
    unstarted_games = Game.where(state: Game.states[:created])
    your_games = Game.joins(:players).where(game_players: { user_id: user_id })
    @game_index_props = { 
      :chatPath => chat_path,
      :newGamePath => new_game_path,
      :unstartedGames => unstarted_games.map { |g| to_game_info g },
      :yourGames => your_games.map { |g| to_game_info g },
    }
  end

  def show
    game = Game.find(params[:id])
    state = GameRoomStateProvider.new(game, current_user).get_state

    @game_room_props = {
      :component_props => {
        :links => {
          :games => games_path,
          :host => request.host_with_port
        }
      },
      :store_props => state
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

  private
    def to_game_info (game)
      {
        :id => game.id,
        :title => game.name,
        :creator => game.creator.email,
        :created_at => game.created_at,
        :path => url_for(game)
      }
    end

end
