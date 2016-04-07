class RoundOperative < ActiveRecord::Base

  # ===== Schema =====
  # :round (:round_id) => Round
  # :operative (:operative_id) => User
  # :pass => boolean (nil)
  # :created_at => datetime
  # :updated_at => datetime

  belongs_to :round, inverse_of: :operatives
  belongs_to :operative, class_name: "User"

  def submitted?
    not pass.nil?
  end

  # for json state (can't have ?)
  def submitted
    submitted?
  end

  def as_state
    # include the list of operatives, but not their submission
    as_json({ only: [:id, :operative_id, :submitted] })
  end
end
