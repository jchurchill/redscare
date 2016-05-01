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
    game = games(:game_reducer_game_testcase_3)
    
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

  test "game 4 - nominations made, votes made, gets rejected" do
    game = games(:game_reducer_game_testcase_4)
    
    # players 2 through 5 join
    (2..5).each do |i|
      user = users(:"user_#{i}")
      game = dispatch_assert_success(game, :player_join, { user_id: user.id })
    end

    # game starts
    game = dispatch_assert_success(game, :start)

    # new round, new nomination
    game = dispatch_assert_success(game, :new_round)
    game = dispatch_assert_success(game, :new_nomination)

    # nominations made
    leader_id = game.current_leader_id
    [2,3].each do |i|
      user_id = users(:"user_#{i}").id
      game = dispatch_assert_success(game, :nominate_player, {
        selecting_user_id: leader_id,
        selected_user_id: user_id
      })

      # verify that nomination has nominee
      nominee_ids = game.current_round.current_nomination.nominees.map { |n| n.id }.to_a
      assert_includes nominee_ids, user_id
    end
    assert_equal 2, game.current_round.current_nomination.nominees.count

    # voting started
    game = dispatch_assert_success(game, :start_voting)

    assert game.current_round.current_nomination.voting?

    # votes cast - 2 upvotes, 3 downvotes
    [[1,true],[2,false],[3,false],[4,true],[5,false]].each do |vote|
      user_id = users(:"user_#{vote[0]}").id
      upvote = vote[1]
      game = dispatch_assert_success(game, :cast_vote, {
        voting_user_id: user_id,
        upvote: upvote
      })

      # verify vote was cast
      votes = game.current_round.current_nomination.votes
      user_vote = votes.find { |v| v.user_id == user_id }
      assert_not_nil user_vote
      assert_equal upvote, user_vote.upvote
    end
    assert_equal 5, game.current_round.current_nomination.votes.count

    # complete nomination
    game = dispatch_assert_success(game, :complete_nomination)

    nomination = game.current_round.current_nomination
    assert nomination.complete?
    assert_not_nil nomination.outcome
    assert nomination.rejected?
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