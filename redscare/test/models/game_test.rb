require 'test_helper'

class GameTest < ActiveSupport::TestCase

  test "game properties" do
    game = games(:vanilla_6)

    %w(name player_count creator
      includes_seer includes_seer_deception includes_rogue_evil includes_evil_master
      includes_seer? includes_seer_deception? includes_rogue_evil? includes_evil_master?
      state outcome assassinated_player assassinated_player_id
      created_at updated_at players rounds)
    .each do |prop|
      assert_respond_to game, prop
    end

    # test state enum - every state should create a method <state>? and <state>!
    %w(created rounds_in_progress assassination complete cancelled)
      .product(["!", "?"])
      .collect { |state, s| :"#{state}#{s}" }.each do |sym|
        assert_respond_to game, sym
      end
    # same for the outcomes enum
    %w(good_wins_normally evil_wins_normally evil_wins_from_assassination evil_wins_from_nomination_failure)
      .product(["!", "?"])
      .collect { |outcome, s| :"#{outcome}#{s}" }.each do |sym|
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

  test "game start" do
    game = games(:vanilla_6_ready_to_start)
    game.start!

    assert_equal "rounds_in_progress", game.state
    assert_equal 6, game.players.count

    roles = game.players.map { |gp| gp.role }
    expected_roles = [:seer, :seer_knower, :assassin, :false_seer, :good_normal, :good_normal].map { |r| r.to_s }
    assert_collection_equal expected_roles, roles
    
    assert_equal 1, game.rounds.count
    round = game.rounds.first
    assert_equal 1, round.round_number
    assert_equal "nomination", round.state
    assert_nil round.outcome
  end
end
