import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as roundPlayActionCreators from '../actions/roundPlayActionCreators';
import Game from 'lib/game/gameHelper';
import User from 'lib/game/userHelper';
import websocket from 'lib/websocket/websocket';

class RoundPlayContainer extends React.Component {
  static propTypes = {
      game: PropTypes.instanceOf(Game).isRequired,
      user: PropTypes.instanceOf(User).isRequired
  };

  constructor(props, context) {
    super(props, context);

    // Bind websocket events once in the constructor.
    // We need props for the game_id to know which channel to listen to.
    this.gameClient = websocket.gameClientFactory(props.game.id);
    // this.gameClient.bind(...);
  }

  isCurrentUserLeader() {
    const { game, user } = this.props
    return game.currentRound.currentLeader.id == user.id;
  }

  render() {
    const { game } = this.props
    return (
      <div>
        <h2>Round {game.currentRound.roundNumber}</h2>
        <div>
          {
            this.isCurrentUserLeader()
            ? <span>You are the round leader.</span>
            : <span>{game.currentRound.currentLeader.name} is the round leader.</span>
          }
        </div>
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  const { game, user } = state.gameRoomStore;
  return {
    game: new Game(game),
    user: new User(user)
  };
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(roundPlayActionCreators, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(RoundPlayContainer);