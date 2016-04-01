class GameRoomStateProvider

  def initialize (game, user)
    if game.nil?
      raise "Game cannot be nil";
    end
    if user.nil?
      raise "User cannot be nil";
    end
    @game = game
    @user = user
    @secrets_provider = GameSecretsProvider.new(game, user)
  end

  def get_state
    {
      :user => @user,
      :game => @game.as_state,
      :secrets => @secrets_provider.secret_info
    }
  end
end