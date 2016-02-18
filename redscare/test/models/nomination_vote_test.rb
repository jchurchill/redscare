require 'test_helper'

class NominationVoteTest < ActiveSupport::TestCase
  test "nomination_vote properties" do
    nomination_vote = nomination_votes(:vanilla_6_round_1_nom_1_vote_1)

    %w(nomination user upvote upvote? created_at updated_at)
    .each do |prop|
      assert_respond_to nomination_vote, prop
    end
  end
end
