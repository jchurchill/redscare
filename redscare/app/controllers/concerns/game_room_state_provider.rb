module GameRoomStateProvider

  def self.get_state (game, user)
    {
      :user => user,
      :game => game.as_state,
      :secrets => GameSecretsProvider.secret_info(game, user.id)
    }
  end

end