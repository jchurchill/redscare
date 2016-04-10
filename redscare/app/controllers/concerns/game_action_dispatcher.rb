class GameActionDispatcher

  # Maps action on game => event to trigger on websocket when it happens
  @@outgoing_event_map = {
    :player_join              => :player_joined,
    :player_leave             => :player_left,
    :start                    => :game_started,
    :new_round                => :new_round,
    :new_nomination           => :new_nomination,
    :nominate_player          => :player_nominated,
    :start_voting             => :voting_started,
    :cast_vote                => :vote_cast,
    :complete_nomination      => :nomination_completed,
    :start_mission            => :mission_started,
    :mission_submit           => :submission_cast,
    :complete_mission         => :mission_completed,
    :begin_assassination      => :assassination_begun,
    :select_assassin_target   => :assassin_target_selected,
    :complete_game            => :game_completed,
  }

  def initialize(game_id)
    @game_id = game_id
  end

  def dispatch(action, data = nil)
    # Lock the game row while we read / update it
    dispatch_result =
      game.with_lock do
        GameReducer.dispatch(game, action, data)
      end
    outgoing_event_name = @@outgoing_event_map[action]
    if dispatch_result[:success] and not outgoing_event_name.nil?
      broadcast_update_to_room outgoing_event_name, dispatch_result[:state]
    end
    return dispatch_result
  end

  private
    def broadcast_update_to_room(event, game)
      state = { game: game.as_state }
      WebsocketRails[channel_name].trigger event, state, :namespace => 'game_room'
      broadcast_secrets_to_players(event, game)
    end

    def broadcast_secrets_to_players(event, game)
      game.players.each do |player|
        user_id = player.user_id
        state = { secrets: GameSecretsProvider.secret_info(game, user_id) }
        p "User #{user_id} secrets:"
        p state[:secrets]
        WebsocketRails.users[user_id].send_message event, state, :namespace => 'game_room', :channel => channel_name
      end
    end

    def channel_name
      :"game_room:#{@game_id}"
    end

    def game
      Game.find(@game_id)
    end
end