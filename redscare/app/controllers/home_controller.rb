class HomeController < ApplicationController

  # All methods on this controller require logged-in user;
  # if hitting otherwise, redirect to login page
  before_filter :authenticate_user!

  def index
    @game_index_props = { 
      :chatPath => chat_path,
      :newGamePath => new_game_path
    }
  end
end
