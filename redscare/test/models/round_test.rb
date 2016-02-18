require 'test_helper'

class RoundTest < ActiveSupport::TestCase
  test "round properties" do
    round = rounds(:vanilla_6_round_1)

    %w(game round_number state outcome created_at updated_at operatives nominations)
    .each do |prop|
      assert_respond_to round, prop
    end
  end

  test "game association" do
    round = rounds(:vanilla_6_round_1)
    assert_equal games(:vanilla_6), round.game
  end

  test "operatives association" do
    round = rounds(:vanilla_6_round_1)
    assert_equal 2, round.operatives.count
    (1..2).each do |id|
      assert_includes round.operatives, round_operatives(:"vanilla_6_round_1_op_#{id}")
    end
  end

  test "nominations association" do
    round = rounds(:vanilla_6_round_1)
    assert_equal 2, round.nominations.count
    (1..2).each do |id|
      assert_includes round.nominations, nominations(:"vanilla_6_round_1_nom_#{id}")
    end
  end
end
