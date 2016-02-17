class RoundOperative < ActiveRecord::Base

  # ===== Schema =====
  # :round (:round_id) => Round
  # :operative (:operative_id) => User
  # :pass => boolean (nil)
  # :created_at => datetime
  # :updated_at => datetime

  belongs_to :round, inverse_of: :operatives
  belongs_to :operative, class_name: "User"
end
