import React, { PropTypes } from 'react';
import GameRoom from '../components/GameRoom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as gameRoomActionCreators from '../actions/gameRoomActionCreators';
import websocket from 'lib/websocket/websocket'

class GameRoomContainer extends React.Component {
  static propTypes = {
    actions: PropTypes.shape({
      updateConnectionStatus: PropTypes.func.isRequired
    }).isRequired,
    connected: PropTypes.bool.isRequired,
    game: PropTypes.object.isRequired,
    links: PropTypes.shape({
      games: PropTypes.string.isRequired,
      host: PropTypes.string.isRequired
    }).isRequired
  };

  constructor(props, context) {
    super(props, context);

    // Initialize the websocket as this root component is spinning up
    console.log(props.links)
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
    updateConnectionStatus(true);
  }

  onWebsocketClose(data, ws) {
    const { updateConnectionStatus } = this.props.actions
    console.log("Game room websocket connection closed", data);
    updateConnectionStatus(false);
  }

  onWebsocketError(data, ws) {
    const { updateConnectionStatus } = this.props.actions
    console.log("Game room websocket connection encountered error", data);
    updateConnectionStatus(false);
  }

  render() {
    const { connected, game, links } = this.props
    return (
      <div>
        <GameRoom game={game}/>
        <div>
          <a href={links.games}>Back to games</a>
        </div>
        <div>
          { connected ? "Connected to server!" : "Not connected to server." }
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { connected, game } = state.gameRoomStore;
  return { connected, game };
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
