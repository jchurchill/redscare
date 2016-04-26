import React, { PropTypes } from 'react';
import PlayerList from '../components/PlayerList';
import Game from 'lib/game/gameHelper';
import User from 'lib/game/userHelper';

class PlayersJoiningContainer extends React.Component {
  static propTypes = {
    game: PropTypes.instanceOf(Game).isRequired,
    user: PropTypes.instanceOf(User).isRequired,
    actions: PropTypes.shape({
      joinRoom: PropTypes.func.isRequired,
      leaveRoom: PropTypes.func.isRequired,
      startGame: PropTypes.func.isRequired
    }).isRequired
  };

  constructor(props) {
    super(props);
    // When a game is started, we wait for the server to respond
    // that it has initialized the game. While waiting, display ui cue
    this.state = { waitingForGameInit: false };
  }

  joinGame() {
    const { user, actions } = this.props;
    actions.joinRoom(user);
  }

  leaveGame() {
    const { user, actions } = this.props;
    actions.leaveRoom(user);
  }

  startGame() {
    const { actions } = this.props;
    actions.startGame();
    this.setState({ waitingForGameInit: true });
  }

  canJoin() {
    const { user, game } = this.props
    // Can join if game still needs players, and you're not currently in the game
    return game.players.length < game.playerCount 
        && !game.players.some((p) => p.id === user.id);
  }

  canLeave() {
    const { user, game } = this.props
    // Can leave if you're not the creator and you're currently in the game
    return !this.isCurrentUserGameCreator() && game.players.some((p) => p.id === user.id);
  }

  isCurrentUserGameCreator() {
    return this.isGameCreator(this.props.user.id);
  }

  isGameCreator(userId) {
    return userId === this.props.game.creatorId;
  }

  isGameReadyToStart() {
    const { game } = this.props;
    return game.players.length === game.playerCount;
  }

  render() {
    const { game } = this.props
    const { waitingForGameInit } = this.state
    return (
      <div>
        <h2>Waiting for players</h2>
        <h3>Currently in game:</h3>
        <PlayerList players={game.players} />
        <div style={{ margin: '30px' }}>
          { this.canJoin() ? <button onClick={this.joinGame.bind(this)}>Join</button> : '' }
          { this.canLeave() ? <button onClick={this.leaveGame.bind(this)}>Leave</button> : '' }
        </div>
        <div>
          {
            this.isGameReadyToStart()
              ? this.isCurrentUserGameCreator()
                ? <div>
                    <button onClick={this.startGame.bind(this)} disabled={waitingForGameInit}>Start</button>
                    <div style={{ display:"inline-block", marginLeft: '15px' }}>
                      { waitingForGameInit
                        ? "Setting up game..."
                        : "All set! Press start to begin the game."
                      }
                    </div>
                  </div>
                : <div>All set! Waiting for the leader to begin.</div>
              : <div style={{ fontWeight: 'bold' }}>{game.players.length} / {game.playerCount} players in game</div>
          }
        </div>
      </div>
    );
  }
}

export default PlayersJoiningContainer;