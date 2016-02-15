class RoundOperative < ActiveRecord::Base
  belongs_to :round, inverse_of: :operatives
  belongs_to :operative, class_name: "User"
end
