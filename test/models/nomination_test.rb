require 'test_helper'

class NominationTest < ActiveSupport::TestCase
  test "nomination properties" do
    nomination = nominations(:vanilla_6_round_1_nom_1)

    %w(round leader nomination_number state outcome created_at updated_at nominees votes)
    .each do |prop|
      assert_respond_to nomination, prop
    end
  end

  test "nominees association" do
    nomination = nominations(:vanilla_6_round_1_nom_1)
    assert_equal 2, nomination.nominees.count
    (1..2).each do |id|
      assert_includes nomination.nominees, users(:"user_#{id}")
    end
  end

  test "votes association" do
    nomination = nominations(:vanilla_6_round_1_nom_1)
    assert_equal 6, nomination.votes.count
    (1..6).each do |id|
      assert_includes nomination.votes, nomination_votes(:"vanilla_6_round_1_nom_1_vote_#{id}")
    end
  end
end
