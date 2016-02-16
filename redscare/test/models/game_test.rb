require 'test_helper'

class GameTest < ActiveSupport::TestCase
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
    game = Game.create(properties)

    # re-read
    game = Game.find(game.id)

    assert_equal properties[:name],                     game.name, "name did not save correctly"
    assert_equal properties[:player_count],             game.player_count, "player_count did not save correctly"
    assert_equal properties[:creator],                  game.creator, "creator did not save correctly"
    assert_equal properties[:includes_seer],            game.includes_seer, "includes_seer did not save correctly"
    assert_equal properties[:includes_seer_deception],  game.includes_seer_deception, "includes_seer_deception did not save correctly"
    assert_equal properties[:includes_evil_master],     game.includes_evil_master, "includes_evil_master did not save correctly"
    assert_equal properties[:includes_rogue_evil],      game.includes_rogue_evil, "includes_rogue_evil did not save correctly"
  end

  test "game creator association" do

    game = Game.find(games(:vanilla_6).id)
    creator = game.creator
    expected_creator = users(:user_1)

    assert_equal expected_creator.id, creator.id, "creator.id did not have expected value"
    assert_equal expected_creator.email, creator.email, "creator.email did not have expected value"
  end

  test "game players association" do
    game = Game.find(games(:vanilla_6).id)
    players = game.players

    assert_equal 6, players.count, "the number of players in the game was incorrect"
    # just check a couple of the players that's supposed to be there are there
    [:vanilla_6_player_1, :vanilla_6_player_6].each do |id|
      exp_game_player = game_players(id)
      assert_includes players, exp_game_player, "expected player was not in the game"
    end 
  end
end