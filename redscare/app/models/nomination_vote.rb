class NominationVote < ActiveRecord::Base
  belongs_to :nomination
  belongs_to :user
end
