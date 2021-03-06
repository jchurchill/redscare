class GamePlayer < ActiveRecord::Base

  # ===== Schema =====
  # :game (:game_id) => Game
  # :user (:user_id) => User
  # :role => int (nil) (GamePlayer.roles)
  # :created_at => datetime
  # :updated_at => datetime

  enum role: {
    # A good guy with no special information
    good_normal:  1,
    # A bad guy who knows who other bad guys are (except rogue_evil, if present)
    evil_normal:  2,
    # A good guy who knows who all the bad guys are (except evil_master, if present)
    seer:         3,
    # A good guy who knows the set of players containing [seer, false_seer], but doesn't know which is which 
    seer_knower:  4,
    # A bad guy who attempts to confuse seer_knower because of her unique position
    false_seer:   5,
    # A bad guy who doesn't know who other bad guys are, and they do not know who he is
    rogue_evil:   6,
    # A bad guy who is hidden from the seer
    evil_master:  7,
    # A bad guy who gets a single guess at who the seer is if the good guys are victorious; if correct, the victory instead goes to the bad guys
    assassin:     8
  }

  belongs_to :game, inverse_of: :players
  belongs_to :user

  def is_evil?
    GameRules.is_role_evil(role)
  end

  def is_good?
    GameRules.is_role_good(role)
  end

  def is_evil # for json
    is_evil?
  end

  def as_state
    if game.assassination?
      # Include who is good and who is evil, and if evil, their exact role
      only = [:id, :user, :is_evil]
      only << :role if is_evil?
      return as_json({ include: :user, only: only, methods: [:is_evil] })
    elsif game.complete? or game.cancelled?
      # Include full role information
      return as_json({ include: :user, only: [:id, :user, :role] })
    else
      # Include the list of players, but not their secret role
      return as_json({ include: :user, only: [:id, :user] })
    end
  end
    
end
