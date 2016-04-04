module GameSecretsProvider

  def self.secret_info(game, user_id)
    # Player not in the game; no role info
    return { } if not game.is_in_game? user_id
    
    game_player = game.players.find { |p| p.user_id == user_id }

    return { role: game_player.role, role_info: role_specific_info(game_player, game.players) }
  end

  private 
    def self.role_specific_info (game_player, all_players)
      if game_player.role.nil?
        # Role not yet assigned; no role info
        return { }
      end

      if game_player.seer?
        # Can see all evils except the evil master
        known_to_seer = all_players
          .find_all { |p| p.is_evil? and not p.evil_master? }
          .map { |p| p.user_id }
        return { known_evils: known_to_seer.to_a }
      end

      if game_player.seer_knower?
        # Can see the set of [seer, false_seer], but not who is who
        known_to_seer_knower = all_players
          .find_all { |p| p.seer? or p.false_seer? }
          .map { |p| p.user_id }
        return { possible_seers: known_to_seer_knower.to_a }
      end

      if game_player.evil_normal? or game_player.assassin? or game_player.evil_master? or game_player.false_seer?
        # Can see other evils who aren't rogue_evil
        known_to_evil_normal = all_players
          .find_all { |p| p.is_evil? and not p.rogue_evil? }
          .map { |p| p.user_id }
        return { known_evils: known_to_evil_normal.to_a }
      end

      if (game_player.rogue_evil? or game_player.good_normal?)
        # No extra known information
        return { }
      end
    end
end