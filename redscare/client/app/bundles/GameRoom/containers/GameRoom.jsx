import React, { PropTypes } from 'react';
import GameRoomContainer from '../components/GameRoomContainer';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Immutable from 'immutable';
import * as gameRoomActionCreators from '../actions/gameRoomActionCreators';
import connectWebsocket from 'lib/websocket/websocket'

// Simple example of a React "smart" component
class GameRoom extends React.Component {
  static propTypes = {
    actions: PropTypes.shape({
      updateName: PropTypes.func.isRequired
    }).isRequired,
    $$gameRoomStore: PropTypes.instanceOf(Immutable.Map).isRequired,
  };

  constructor(props, context) {
    super(props, context);
  }

  // Connect to the websocket once the component is first mounted
  componentDidMount() {
    connectWebsocket({
      root: "localhost:3000",
      onOpen: (data) => console.log("Game room websocket connection established", data.connection_id)
    })
  }

  render() {
    return (
      <GameRoomContainer />
    );
  }
}

const mapStateToProps = (state) => {
  return { $$gameRoomStore: state.$$gameRoomStore };
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
