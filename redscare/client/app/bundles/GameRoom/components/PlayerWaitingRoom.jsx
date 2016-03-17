import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as playerWaitingRoomActionCreators from '../actions/playerWaitingRoomActionCreators';
import websocket from 'lib/websocket/websocket';

class PlayerWaitingRoom extends React.Component {
  static propTypes = {
      game: PropTypes.object.isRequired,
      user: PropTypes.object.isRequired
  };

  constructor(props, context) {
    super(props, context);

    // Bind websocket events once in the constructor.
    // We need props for the game_id to know which channel to listen to.
    const gameChannel = websocket.getDispatcher().subscribe(`game_${props.game.id}`);
    gameChannel.bind("game_room.player_joined", this.playerJoined.bind(this));
    gameChannel.bind("game_room.player_left", this.playerLeft.bind(this));
  }

  playerJoined(gamePlayers) {
    this.props.actions.playerJoined(gamePlayers);
  }

  playerLeft(gamePlayers) {
    console.log("a player left the game");
    this.props.actions.playerLeft(gamePlayers);
  }

  joinGame() {
    const { game, user, actions } = this.props;
    actions.joinRoom(user);
    websocket.getDispatcher().trigger("game_room.join_room", { game_id: game.id, user_id: user.id });
  }

  leaveGame() {
    const { game, user, actions } = this.props;
    actions.leaveRoom(user);
    websocket.getDispatcher().trigger("game_room.leave_room", { game_id: game.id, user_id: user.id });
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

  render() {
    const players = this.getJoinedPlayers()
    return (
      <div>
        <h2>Waiting for players</h2>
        <h3>Currently in game:</h3>
        <div>
          {
            players.map((p) => 
              <span key={p.id} style={{ margin: '0 5px', padding: '5px', border: '1px solid black' }}>{p.email}</span>
            )
          }
        </div>
        <div style={{ margin: '30px' }}>
          { this.canJoin() ? <button onClick={this.joinGame.bind(this)}>Join</button> : '' }
          { this.canLeave() ? <button onClick={this.leaveGame.bind(this)}>Leave</button> : '' }
          { this.isGameCreator() ? <span>You are the creator of this game.</span> : '' }
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

export default connect(mapStateToProps, mapDispatchToProps)(PlayerWaitingRoom);