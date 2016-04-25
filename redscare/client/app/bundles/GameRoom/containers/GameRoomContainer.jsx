import React, { PropTypes } from 'react';
import GameRoom from '../components/GameRoom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as gameRoomActionCreators from '../actions/gameRoomActionCreators';
import listenForStateUpdates from './gameRoomEventListener.js';
import { connectionStates } from '../constants/gameRoomConstants';
import Game from 'lib/game/gameHelper';
import websocket from 'lib/websocket/websocket'

class GameRoomContainer extends React.Component {
  static propTypes = {
    actions: PropTypes.shape({
      updateConnectionStatus: PropTypes.func.isRequired,
      stateUpdated: PropTypes.func.isRequired,
    }).isRequired,
    connectionState: PropTypes.string.isRequired,
    game: PropTypes.instanceOf(Game).isRequired,
    links: PropTypes.shape({
      games: PropTypes.string.isRequired,
      host: PropTypes.string.isRequired
    }).isRequired
  };

  constructor(props, context) {
    super(props, context);

    const { links: { host }, game: { id: gameId }, actions: { stateUpdated } } = props

    // Initialize the websocket as this root component is spinning up
    websocket.initialize({
      host: host,
      onOpen: this.onWebsocketOpen.bind(this),
      onClose: this.onWebsocketClose.bind(this),
      onError: this.onWebsocketError.bind(this)
    })
    // Listen to all server events that update the state of the game room (e.g., other players taking actions)
    listenForStateUpdates(websocket.gameClientFactory(gameId), stateUpdated);
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

  renderConnectionInfo() {
    const { connectionState } = this.props
    const { text, color } = {
        [connectionStates.CONNECTING]: { text: "Connecting to server...", color: 'white' },
        [connectionStates.CONNECTED]: { text: "Connected to server!", color: 'lightcyan' },
        [connectionStates.DISCONNECTED]: { text: "Not connected to server.", color: 'lightpink' },
      }[connectionState];

    return (
      <div style={{ marginTop: '10px', padding: '5px', backgroundColor: color }}>
        {text}
      </div>
    )
  }

  render() {
    const { game, links } = this.props
    return (
      <div style={{ textAlign: 'center' /* center everything! */ }}>
        <GameRoom game={game}/>
        <div>
            <a href={links.games}>Back to games</a>
        </div>
        {this.renderConnectionInfo()}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { connectionState, game, secrets } = state.gameRoomStore;
  return { connectionState, game: new Game(game, secrets) };
}

const mapDispatchToProps = (dispatch) => {
  // Add a prop called "actions" which is an object containing the action
  // dispatchers for action creators defined in gameRoomActionCreators 
  return { actions: bindActionCreators(gameRoomActionCreators, dispatch) };
}

// Make the store API available to this compnent.
// Specifically, provide it with props from store state, 
// and provide it with props based on the store dispatch
export default connect(mapStateToProps, mapDispatchToProps)(GameRoomContainer);
