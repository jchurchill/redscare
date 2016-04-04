require 'test_helper'

class GameReducerTest < ActiveSupport::TestCase
  
  test "game 1 - player joins and leaves" do
    game = games(:game_reducer_game_testcase_1)
    game = dispatch_assert_success(game, :player_join, { user_id: users(:user_2).id })

    assert_includes game.players.map { |pl| pl.user }, users(:user_2)

    game = dispatch_assert_success(game, :player_leave, { user_id: users(:user_2).id })

    assert_not_includes game.players.map { |pl| pl.user }, users(:user_2)
  end

  test "game 2 - players join, 1 leaves, other joins" do
    game = games(:game_reducer_game_testcase_2)
    
    # players 2 through 5 join
    (2..5).each do |i|
      user = users(:"user_#{i}")
      game = dispatch_assert_success(game, :player_join, { user_id: user.id })
    end

    # player 2 leaves
    game = dispatch_assert_success(game, :player_leave, { user_id: users(:user_2).id })

    # player 6 joins
    game = dispatch_assert_success(game, :player_join, { user_id: users(:user_6).id })
    
    assert_collection_equal(
      [1,3,4,5,6].map { |i| users(:"user_#{i}") },
      game.players.map { |pl| pl.user }
    )
  end

  test "game 3 - players join, game starts" do
    game = games(:game_reducer_game_testcase_2)
    
    # players 2 through 5 join
    (2..5).each do |i|
      user = users(:"user_#{i}")
      game = dispatch_assert_success(game, :player_join, { user_id: user.id })
    end

    game = dispatch_assert_success(game, :start)

    assert game.rounds_in_progress?
    game.players.each { |pl| assert_not pl.role.nil? }
    # vanilla 5-player game = should have 2 normal evil and 3 normal good
    assert_equal(5, game.players.count)
    assert_equal(2, game.players.select { |pl| pl.evil_normal? }.count)
    assert_equal(3, game.players.select { |pl| pl.good_normal? }.count)

    game = dispatch_assert_success(game, :new_round)

    # Check round was created properly
    assert_equal 1, game.rounds.count
    new_round = game.rounds.first
    assert_equal new_round, game.current_round
    assert_equal 1, new_round.round_number
    assert new_round.nomination?

    game = dispatch_assert_success(game, :new_nomination)

    # Check nomination was created properly
    assert_equal 1, game.current_round.nominations.count
    new_nomination = game.current_round.nominations.first
    assert_equal new_nomination, game.current_round.current_nomination
    assert_equal 1, new_nomination.nomination_number
    assert new_nomination.selecting?
    assert_includes game.players.map { |pl| pl.user }, new_nomination.leader

  end

  private
    def dispatch_assert_success(game, action, data = nil)
      result = GameReducer.dispatch(game, action, data)
      assert result[:success]
      return result[:state]
    end

    def dispatch_assert_failure(game, action, data = nil)
      result = GameReducer.dispatch(game, action, data)
      assert_not result[:success]
      return result[:state]
    end
end