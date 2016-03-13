import React, { PropTypes } from 'react';
import GameRoomContainer from '../components/GameRoomContainer';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as gameRoomActionCreators from '../actions/gameRoomActionCreators';
import websocket from 'lib/websocket/websocket'

class GameRoom extends React.Component {
  static propTypes = {
    actions: PropTypes.shape({
      updateConnectionStatus: PropTypes.func.isRequired
    }).isRequired,
    connected: PropTypes.bool.isRequired,
  };

  constructor(props, context) {
    super(props, context);
  }

  // Connect to the websocket once the component is first mounted
  componentDidMount() {
    const { updateConnectionStatus } = this.props.actions
    websocket.initialize({
      root: "localhost:3000",
      onOpen: (data, ws) => {
        console.log("Game room websocket connection established", data.connection_id);
        updateConnectionStatus(true);
      },
      onClose: (data, ws) => {
        console.log("Game room websocket connection closed", data);
        updateConnectionStatus(false);
      },
      onError: (data, ws) => {
        console.log("Game room websocket connection encountered error", data);
        updateConnectionStatus(false);
      }
    })
  }

  render() {
    const { connected } = this.props
    return (
      <div>
        <GameRoomContainer />
        <div>
          { connected ? "Connected to server!" : "Not connected to server." }
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { connected } = state.gameRoomStore;
  return { connected };
}

const mapDispatchToProps = (dispatch) => {
  // Add a prop called "actions" which is an object containing the action
  // dispatchers for action creators defined in gameRoomActionCreators 
  return { actions: bindActionCreators(gameRoomActionCreators, dispatch) };
}

// Make the store API available to this compnent.
// Specifically, provide it with props from store state, 
// and provide it with props based on the store dispatch
export default connect(mapStateToProps, mapDispatchToProps)(GameRoom);
