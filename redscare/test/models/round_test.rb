require 'test_helper'

class RoundTest < ActiveSupport::TestCase
  test "expected round properties" do
    round = rounds(:vanilla_6_round_1)

    [:game, :round_number, :state, :outcome, :created_at, :updated_at, :operatives, :nominations].each do |sym|
      assert_respond_to round, sym
    end
  end
end
