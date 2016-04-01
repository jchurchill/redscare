class GameRules
  
  @@roles = {
    :good_normal => { good: true  },
    :evil_normal => { good: false },
    :seer        => { good: true  },
    :seer_knower => { good: true  },
    :false_seer  => { good: false },
    :rogue_evil  => { good: false },
    :evil_master => { good: false },
    :assassin    => { good: false },
  }

  def self.is_role_good (role)
    @@roles[role.to_sym][:good]
  end

  def self.is_role_evil (role)
    not @@roles[role.to_sym][:good]
  end

  # player_count => number of evil roles in game
  @@evil_roles_by_player_count = {
    5 => 2, 6 => 2, 7 => 3, 8 => 3, 9 => 3, 10 => 4 
  }

  def self.evil_role_count (player_count)
    @@evil_roles_by_player_count[player_count]
  end

  # player_count => each round's (in order) [(operative_count, required_fail_count)]
  @@round_mission_properties = {
    5 =>  [[2,1],[3,1],[2,1],[3,1],[3,1]],
    6 =>  [[2,1],[3,1],[4,1],[3,1],[4,1]],
    7 =>  [[2,1],[3,1],[3,1],[4,2],[4,1]],
    8 =>  [[3,1],[4,1],[4,1],[5,2],[5,1]],
    9 =>  [[3,1],[4,1],[4,1],[5,2],[5,1]],
    10 => [[3,1],[4,1],[4,1],[5,2],[5,1]],
  }

  def self.round_mission_properties (player_count, round_number)
    props = @@round_mission_properties[player_count][round_number - 1]
    { operative_count: props[0], required_fail_count: props[1] }
  end

end