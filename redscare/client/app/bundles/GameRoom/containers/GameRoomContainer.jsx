// React / redux
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as gameRoomActionCreators from '../actions/gameRoomActionCreators';

// Components
import GameRoom from '../components/GameRoom';

// Other libraries / helpers
import Game from 'lib/game/gameHelper';
import User from 'lib/game/userHelper';
import websocket from 'lib/websocket/websocket';
import { connectionStates, serverEvents, eventNamespace } from '../constants/gameRoomConstants';

class GameRoomContainer extends React.Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    connectionState: PropTypes.string.isRequired,
    game: PropTypes.instanceOf(Game).isRequired,
    user: PropTypes.instanceOf(User).isRequired,
    links: PropTypes.shape({
      games: PropTypes.string.isRequired,
      host: PropTypes.string.isRequired
    }).isRequired
  };

  componentDidMount() {
    const { links: { host }, game: { id: gameId }, actions: { stateUpdated } } = this.props

    // Initialize the websocket as this root component is spinning up
    websocket.initialize({
      host: host,
      onOpen: this.onWebsocketOpen.bind(this),
      onClose: this.onWebsocketClose.bind(this),
      onError: this.onWebsocketError.bind(this)
    })

    // Listen to all server events that update the state of the game room (e.g., other players taking actions)
    this._gameClient = websocket.gameClientFactory(gameId);
    serverEvents.forEach(event => this._gameClient.bind(`${eventNamespace}.${event}`, stateUpdated));
  }

  onWebsocketOpen(data, ws) {
    const { updateConnectionStatus } = this.props.actions
    console.log("Game room websocket connection established", data.connection_id);
    updateConnectionStatus(connectionStates.CONNECTED);
  }

  onWebsocketClose(data, ws) {
    const { updateConnectionStatus } = this.props.actions
    console.log("Game room websocket connection closed", data);
    updateConnectionStatus(connectionStates.DISCONNECTED);
  }

  onWebsocketError(data, ws) {
    const { updateConnectionStatus } = this.props.actions
    console.log("Game room websocket connection encountered error", data);
    updateConnectionStatus(connectionStates.DISCONNECTED);
  }

  getActions() {
    const { actions } = this.props;
    const trigger = (event, data) => this._gameClient.trigger(`${eventNamespace}.${event}`, data)
    return {
      joinRoom: (user) => {
        actions.joinRoom(user);
        trigger('join_room', { user_id: user.id })
      },
      leaveRoom: (user) => {
        actions.leaveRoom(user);
        trigger('leave_room', { user_id: user.id })
      },
      startGame: () => {
        actions.startGame();
        trigger('start_game');
      },
      nominate: (nominationId, nomineeUserId) => {
        actions.nominate(nominationId, nomineeUserId);
        trigger('nominate', { nomination_id: nominationId, user_id: nomineeUserId })
      },
      vote: (nominationId, userId, upvote) => {
        actions.vote(nominationId, userId, upvote);
        trigger('vote', { upvote: upvote });
      },
      missionSubmit: (roundId, userId, pass) => {
        actions.missionSubmit(roundId, userId);
        trigger('mission_submit', { pass });
      },
      selectAssassinTarget: (targetUserId) => {
        actions.selectAssassinTarget(targetUserId);
        trigger('select_assassin_target', { target_user_id: targetUserId });
      }
    }
  }

  render() {
    const { game, user, links, connectionState } = this.props
    const actions = this.getActions()
    return <GameRoom {...{ game, user, links, actions, connectionState }} />
  }
}

const mapStateToProps = (state) => {
  const { connectionState, game, secrets, user } = state.gameRoomStore;
  return {
    connectionState,
    game: new Game(game, secrets),
    user: new User(user)
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(gameRoomActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(GameRoomContainer);
