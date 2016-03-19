import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as roundPlayActionCreators from '../actions/roundPlayActionCreators';
import websocket from 'lib/websocket/websocket';

class RoundPlayContainer extends React.Component {
  static propTypes = {
      game: PropTypes.object.isRequired,
      user: PropTypes.object.isRequired
  };

  constructor(props, context) {
    super(props, context);

    // Bind websocket events once in the constructor.
    // We need props for the game_id to know which channel to listen to.
    this.gameClient = websocket.gameClientFactory(props.game.id);
    // this.gameClient.bind(...);
  }

  getCurrentRound() {
    const { game } = this.props
    return game.rounds.reduce((max, r) => (!max || r.round_number > max.round_number) ? r : max);
  }

  render() {
    const currentRound = this.getCurrentRound()
    return (
      <div>
        <h2>Round {currentRound.round_number}</h2>
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  const { game, user } = state.gameRoomStore;
  return { game, user };
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(roundPlayActionCreators, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(RoundPlayContainer);