import React, { PropTypes } from 'react';
import GameRoom from '../components/GameRoom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as gameRoomActionCreators from '../actions/gameRoomActionCreators';
import { connectionStates } from '../constants/gameRoomConstants';
import websocket from 'lib/websocket/websocket'

class GameRoomContainer extends React.Component {
  static propTypes = {
    actions: PropTypes.shape({
      updateConnectionStatus: PropTypes.func.isRequired
    }).isRequired,
    connectionState: PropTypes.string.isRequired,
    game: PropTypes.object.isRequired,
    links: PropTypes.shape({
      games: PropTypes.string.isRequired,
      host: PropTypes.string.isRequired
    }).isRequired
  };

  constructor(props, context) {
    super(props, context);

    // Initialize the websocket as this root component is spinning up
    websocket.initialize({
      host: props.links.host,
      onOpen: this.onWebsocketOpen.bind(this),
      onClose: this.onWebsocketClose.bind(this),
      onError: this.onWebsocketError.bind(this)
    })
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
      <div>
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
  const { connectionState, game } = state.gameRoomStore;
  return { connectionState, game };
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
