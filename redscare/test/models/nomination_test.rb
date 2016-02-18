require 'test_helper'

class NominationTest < ActiveSupport::TestCase
  test "expected nomination properties" do
    nomination = nominations(:vanilla_6_round_1_nom_1)

    [:round, :leader, :nomination_number, :state, :outcome, :created_at, :updated_at, :nominees, :votes].each do |sym|
      assert_respond_to nomination, sym
    end
  end
end
