import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as playerWaitingRoomActionCreators from '../actions/playerWaitingRoomActionCreators';
import websocket from 'lib/websocket/websocket';

class PlayersJoiningContainer extends React.Component {
  static propTypes = {
      game: PropTypes.object.isRequired,
      user: PropTypes.object.isRequired
  };

  constructor(props, context) {
    super(props, context);

    // Bind websocket events once in the constructor.
    // We need props for the game_id to know which channel to listen to.
    this.gameClient = websocket.gameClientFactory(props.game.id);
    this.gameClient.bind("game_room.player_joined", this.playerJoined.bind(this));
    this.gameClient.bind("game_room.player_left", this.playerLeft.bind(this));
    this.gameClient.bind("game_room.game_started", this.gameStarted.bind(this));
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
    const { game, user, actions } = this.props;
    actions.joinRoom(user);
    this.gameClient.trigger("game_room.join_room", { user_id: user.id });
  }

  leaveGame() {
    const { game, user, actions } = this.props;
    actions.leaveRoom(user);
    this.gameClient.trigger("game_room.leave_room", { user_id: user.id });
  }

  startGame() {
    const { actions } = this.props;
    actions.startGame();
    this.gameClient.trigger("game_room.start_game");
  }

  canJoin() {
    const { user, game } = this.props
    const players = this.getJoinedPlayers()
    // Can join if game still needs players, and you're not currently in the game
    return players.length < game.player_count 
        && !players.some((p) => p.id === user.id);
  }

  canLeave() {
    const userId = this.props.user.id
    const creatorUserId = this.props.game.creator_id
    // Can leave if you're not the creator and you're currently in the game
    return !this.isGameCreator() && this.getJoinedPlayers().some((p) => p.id === userId);
  }

  isGameCreator() {
    const userId = this.props.user.id
    const creatorUserId = this.props.game.creator_id
    return userId === creatorUserId
  }

  getJoinedPlayers() {
    const { players } = this.props.game;
    return players.map((p) => p.user);
  }

  isGameReadyToStart() {
    const { game } = this.props;
    const players = this.getJoinedPlayers();
    return players.length === game.player_count;
  }

  render() {
    const players = this.getJoinedPlayers()
    return (
      <div>
        <h2>Waiting for players</h2>
        <h3>Currently in game:</h3>
        <div>
          {
            players.map((p) => 
              <div key={p.id} style={{ display: "inline-block", margin: '0 5px', padding: '5px', border: '1px solid black' }}>{p.email}</div>
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
              ? this.isGameCreator()
                ? <div>
                    <button onClick={this.startGame.bind(this)}>Start</button>
                    <div style={{ display:"inline-block", marginLeft: '15px' }}>All set! Press start to begin the game.</div>
                  </div>
                : <div>All set! Waiting for the leader to begin.</div>
              : <div>Waiting for players to join...</div>
          }
        </div>
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  const { game, user } = state.gameRoomStore;
  return { game, user };
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(playerWaitingRoomActionCreators, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayersJoiningContainer);