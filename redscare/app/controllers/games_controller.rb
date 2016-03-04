class GamesController < ApplicationController
  def index
  end

  def show
  end

  def new
    @game_creator_props = {
      :createPath => games_path 
    }
  end

  def create
  end
end
