require 'test_helper'

class GamePlayerTest < ActiveSupport::TestCase
  test "expected game_player properties" do
    game_player = game_players(:vanilla_6_player_1)

    [:game, :game_id, :user, :user_id, :role, :created_at, :updated_at].each do |sym|
      assert_respond_to game_player, sym
    end
  end
end
