require 'test_helper'

class NominationVoteTest < ActiveSupport::TestCase
  test "nomination_vote properties" do
    nomination_vote = nomination_votes(:vanilla_6_round_1_nom_1_vote_1)

    %w(nomination user upvote upvote? created_at updated_at)
    .each do |prop|
      assert_respond_to nomination_vote, prop
    end
  end

  test "nomination association" do
    nomination_vote = nomination_votes(:vanilla_6_round_1_nom_1_vote_1)
    assert_equal nominations(:vanilla_6_round_1_nom_1), nomination_vote.nomination
  end

  test "user association" do
    nomination_vote = nomination_votes(:vanilla_6_round_1_nom_1_vote_1)
    assert_equal users(:user_1), nomination_vote.user
  end
end
