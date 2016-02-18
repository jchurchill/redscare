require 'test_helper'

class RoundTest < ActiveSupport::TestCase
  test "round properties" do
    round = rounds(:vanilla_6_round_1)

    %w(game round_number state outcome created_at updated_at operatives nominations)
    .each do |prop|
      assert_respond_to round, prop
    end
  end
end
