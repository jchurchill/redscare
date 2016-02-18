require 'test_helper'

class GamePlayerTest < ActiveSupport::TestCase
  test "expected game_player properties" do
    game_player = game_players(:vanilla_6_player_1)

    [:game, :game_id, :user, :user_id, :role, :created_at, :updated_at].each do |sym|
      assert_respond_to game_player, sym
    end

    # test role enum - every role should create a method <role>? and <role>!
    %w(good_normal evil_normal seer seer_knower false_seer rogue_evil evil_master assassin)
      .product(["!", "?"])
      .collect { |role, s| :"#{role}#{s}" }.each do |sym|
        assert_respond_to game_player, sym
      end
  end

  test "game association" do
    game_player = game_players(:vanilla_6_player_1)
    assert_equal games(:vanilla_6), game_player.game
  end

  test "user association" do
    game_player = game_players(:vanilla_6_player_1)
    assert_equal users(:user_1), game_player.user
  end
end
