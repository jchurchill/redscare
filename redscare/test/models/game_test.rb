require 'test_helper'

class GameTest < ActiveSupport::TestCase

  test "expected game properties" do
    game = games(:vanilla_6)

    [:name, :player_count, :creator, :creator_id,
      :includes_seer, :includes_seer_deception,
      :includes_rogue_evil, :includes_evil_master,
      :state, :outcome,
      :assassinated_player, :assassinated_player_id,
      :created_at, :updated_at,
      :players, :rounds
      ].each do |sym|
      assert_respond_to game, sym
    end
  end

  test "creating a game" do
    properties = {
      name: "My newly-created game",
      player_count: 10,
      creator: users(:user_1),
      includes_seer: false,
      includes_seer_deception: false,
      includes_evil_master: false,
      includes_rogue_evil: false
    }
    game = Game.create!(properties)

    assert_equal properties[:name],                     game.name
    assert_equal properties[:player_count],             game.player_count
    assert_equal properties[:creator],                  game.creator
    assert_equal properties[:includes_seer],            game.includes_seer
    assert_equal properties[:includes_seer_deception],  game.includes_seer_deception
    assert_equal properties[:includes_evil_master],     game.includes_evil_master
    assert_equal properties[:includes_rogue_evil],      game.includes_rogue_evil

    assert_not_nil game.created_at
    assert_not_nil game.updated_at
  end

  test "game creator association" do
    game = games(:vanilla_6)
    assert_equal users(:user_1), game.creator
  end

  test "game players association" do
    game = games(:vanilla_6)
    assert_equal 6, game.players.count
    (1..6).each do |id|
      assert_includes game.players, game_players(:"vanilla_6_player_#{id}")
    end
  end

  test "game rounds association" do
    game = games(:vanilla_6)
    assert_equal 2, game.rounds.count
    (1..2).each do |id|
      assert_includes game.rounds, rounds(:"vanilla_6_round_#{id}")
    end
  end
end
