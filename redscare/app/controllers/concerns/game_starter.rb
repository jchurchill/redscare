class GameStarter
  
  def initialize (game)
    if game.nil?
      raise "Game cannot be nil";
    end
    @game = game
  end

  def start!
    validate

    # get the derived role set for this game, and shuffle them
    role_set = derive_role_set.to_a.shuffle!

    # zip the shuffled list with the players, assigning each his role
    # because the order is random, the role assignment is random
    @game.players.zip(role_set) { |player, role| player.update! role: role }

    # initialize the first round
    @game.rounds << [get_first_round]

    # state is now in progress
    @game.rounds_in_progress!
    @game.save!
  end

  private
    def validate
      if @game.state != Game.states[:created]
        raise "Cannot start a game whose state is not :created"
      end
      if @game.player_count != @game.players.count
        raise "Cannot start a game that doesn't have enough players"
      end
    end

    def derive_role_set
      roles = []
      assigned_evil_roles = 0
      if @game.includes_seer
        roles << GamePlayer.roles[:seer] << GamePlayer.roles[:assassin]
        assigned_evil_roles += 1
      end
      if @game.includes_seer_deception
        roles << GamePlayer.roles[:seer_knower] << GamePlayer.roles[:false_seer]
        assigned_evil_roles += 1
      end
      if @game.includes_rogue_evil
        roles << GamePlayer.roles[:rogue_evil]
        assigned_evil_roles += 1
      end
      if @game.includes_evil_master
        roles << GamePlayer.roles[:evil_master]
        assigned_evil_roles += 1
      end

      # Add any extra normal evils until we've reached the required evil role count
      total_evil_role_count = GameRules.evil_role_count @game.player_count
      remaining_evil_roles = total_evil_role_count - assigned_evil_roles
      if remaining_evil_roles < 0
        raise "Unexpected: more special evil roles included than the game has capacity for"
      end
      remaining_evil_roles.times {
        roles << GamePlayer.roles[:evil_normal]
      }

      # Add any extra normal goods until we've reached the required total role count
      (@game.player_count - roles.count).times {
        roles << GamePlayer.roles[:good_normal] 
      }

      return roles
    end

    def get_first_round
      first_leader = @game.players[rand(@game.player_count)].user
      first_nomination = Nomination.new(state: Nomination.states[:selecting], nomination_number: 1, leader: first_leader)
      
      Round.new(round_number: 1, state: Round.states[:nomination], nominations: [first_nomination])
    end
end