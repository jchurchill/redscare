require 'test_helper'

class RoundOperativeTest < ActiveSupport::TestCase
  test "round operative properties" do
    round_operative = round_operatives(:vanilla_6_round_1_op_1)

    %w(round operative pass pass? created_at updated_at)
    .each do |prop|
      assert_respond_to round_operative, prop
    end
  end

  test "round association" do
    round_operative = round_operatives(:vanilla_6_round_1_op_1)
    assert_equal rounds(:vanilla_6_round_1), round_operative.round
  end

  test "operative association" do
    round_operative = round_operatives(:vanilla_6_round_1_op_1)
    assert_equal users(:user_1), round_operative.operative
  end
end