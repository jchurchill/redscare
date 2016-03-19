import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as playerWaitingRoomActionCreators from '../actions/playerWaitingRoomActionCreators';
import websocket from 'lib/websocket/websocket';
import Game from 'lib/game/gameHelper';
import User from 'lib/game/userHelper';

let gameClient;

class PlayersJoiningContainer extends React.Component {
  static propTypes = {
      game: PropTypes.instanceOf(Game).isRequired,
      user: PropTypes.instanceOf(User).isRequired
  };

  constructor(props, context) {
    super(props, context);

    // Bind websocket events once in the constructor.
    // We need props for the game_id to know which channel to listen to.
    gameClient = websocket.gameClientFactory(props.game.id);
    gameClient.bind("game_room.player_joined", this.playerJoined.bind(this));
    gameClient.bind("game_room.player_left", this.playerLeft.bind(this));
    gameClient.bind("game_room.game_started", this.gameStarted.bind(this));

    // When a game is started, we wait for the server to respond
    // that it has initialized the game. While waiting, display ui cue
    this.state = { waitingForGameInit: false };
  }

  playerJoined(gamePlayers) {
    this.props.actions.playerJoined(gamePlayers);
  }

  playerLeft(gamePlayers) {
    this.props.actions.playerLeft(gamePlayers);
  }

  gameStarted(gameState) {
    this.props.actions.gameStarted(gameState);
  }

  joinGame() {
    const { user, actions } = this.props;
    actions.joinRoom(user);
    gameClient.trigger("game_room.join_room", { user_id: user.id });
  }

  leaveGame() {
    const { user, actions } = this.props;
    actions.leaveRoom(user);
    gameClient.trigger("game_room.leave_room", { user_id: user.id });
  }

  startGame() {
    const { actions } = this.props;
    actions.startGame();
    this.setState({ waitingForGameInit: true });
    gameClient.trigger("game_room.start_game");
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
        <div>
          {
            game.players.map((p) => 
              <div key={p.id} style={{
                display: "inline-block",
                margin: '5px',
                padding: '5px',
                border: '1px solid black',
                backgroundColor: this.isGameCreator(p.id) ? 'lightcyan' : 'white'
              }}>{p.name}</div>
            )
          }
        </div>
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


const mapStateToProps = (state) => {
  const { game, secrets, user } = state.gameRoomStore;
  return {
    game: new Game(game, secrets),
    user: new User(user)
  };
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(playerWaitingRoomActionCreators, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayersJoiningContainer);