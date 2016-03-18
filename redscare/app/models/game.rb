class Game < ActiveRecord::Base

  # ===== Schema =====
  # :name => string
  # :player_count => int
  # :creator (:creator_id) => User
  # :includes_seer => boolean
  # :includes_seer_deception => boolean
  # :includes_evil_master => boolean
  # :includes_rogue_evil => boolean
  # :state => int (Game.states)
  # :outcome => int (nil) (Game.outcomes)
  # :assassinated_player (:assassinated_player_id) => User (nil)
  # :created_at => datetime
  # :updated_at => datetime
  # :players => collection of GamePlayer
  # :rounds => collection of Round

  enum state: {
    # Game is created and looking for players
    created: 1,
    # Game's players and roles finalized; rounds w/ nomination and missions occur; this is the majority of the game
    rounds_in_progress: 2,
    # Good guys have 3 passed missions, but assassin / seer are in the game, and assassin is making his decision on who to kill
    assassination: 3,
    # The game is over, and the outcome can be seen in the outcome property
    complete: 4,
    # The game ended before completion because it was cancelled for some reason (e.g., player left)
    cancelled: -1
  }

  enum outcome: {
    # Good guys get 3 passed missions (and seer is not killed)
    good_wins_normally: 1,
    # Bad guys get 3 failed missions
    evil_wins_normally: 2,
    # Good guys get 3 passed missions, but seer is killed by assassin
    evil_wins_from_assassination: 3,
    # A round's 5th nomination is rejected, causing the bad guys to instantly win
    evil_wins_from_nomination_failure: 4
  }

  belongs_to :creator, class_name: "User"
  belongs_to :assassinated_player, class_name: "User"

  has_many :players, -> { includes :user }, class_name: "GamePlayer"

  has_many :rounds, inverse_of: :game

  def start!
    if player_count != players.count
      raise "Cannot start a game that doesn't have enough players"
    end

    # get the derived role set for this game, and shuffle them
    role_set = derive_role_set.to_a.shuffle!

    # zip the shuffled list with the players, assigning each his role
    players.zip(role_set) { |player, role| player.role = role }

    # initialize the first round
    first_leader = players[rand(player_count)].user
    first_nomination = Nomination.new(state: Nomination.states[:selecting], nomination_number: 1, leader: first_leader)
    first_round = Round.new(round_number: 1, state: Round.states[:nomination], nominations: [first_nomination])
    rounds << [first_round]

    # state is now in progress
    rounds_in_progress!
    save!
  end

  def derive_role_set
    roles = []
    assigned_evil_roles = 0
    if includes_seer
      roles << GamePlayer.roles[:seer] << GamePlayer.roles[:assassin]
      assigned_evil_roles += 1
    end
    if includes_seer_deception
      roles << GamePlayer.roles[:seer_knower] << GamePlayer.roles[:false_seer]
      assigned_evil_roles += 1
    end
    if includes_rogue_evil
      roles << GamePlayer.roles[:rogue_evil]
      assigned_evil_roles += 1
    end
    if includes_evil_master
      roles << GamePlayer.roles[:evil_master]
      assigned_evil_roles += 1
    end

    # Add any extra normal evils until we've reached the required evil role count
    remaining_evil_roles = total_evil_count - assigned_evil_roles
    if remaining_evil_roles < 0
      raise "Unexpected: more special evil roles included than the game has capacity for"
    end
    remaining_evil_roles.times {
      roles << GamePlayer.roles[:evil_normal]
    }

    # Add any extra normal goods until we've reached the required total role count
    (player_count - roles.count).times {
      roles << GamePlayer.roles[:good_normal] 
    }

    return roles
  end

  def total_evil_count
    {
      5 => 2,
      6 => 2,
      7 => 3,
      8 => 3,
      9 => 4,
      10 => 4
    }[player_count]
  end

  def get_public_state
    self.as_json(include: {
        # include the list of players, but not their secret role
        players: {
          include: :user,
          only: :user
        },
        rounds: {
          include: {
            operatives: {
              include: :user,
              # include the list of mission-goers, but not their submission
              only: :user
            },
            nominations: {
              include: {
                nominees: {},
                votes: {
                  # TODO: don't expose upvote / downvote until nomination complete
                  include: :user
                }
              }
            }
          }
        }
      })
  end
end
