require 'test_helper'

class NominationTest < ActiveSupport::TestCase
  test "nomination properties" do
    nomination = nominations(:vanilla_6_round_1_nom_1)

    %w(round leader nomination_number state outcome created_at updated_at nominees votes)
    .each do |prop|
      assert_respond_to nomination, prop
    end
  end
end
