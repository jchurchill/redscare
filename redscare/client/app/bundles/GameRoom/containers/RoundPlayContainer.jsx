import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as roundPlayActionCreators from '../actions/roundPlayActionCreators';

import NominationPhase from '../components/phases/nomination/NominationPhase'

import Game from 'lib/game/gameHelper';
import Round from 'lib/game/roundHelper';
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

  nominate() {
    console.log("nominate!")
  }

  isCurrentUserLeader() {
    const { game: { currentRound: { currentLeader } }, user } = this.props
    return currentLeader.id === user.id;
  }

  renderCurrentRoundView() {
    const { game: { currentRound }, user } = this.props
    switch(currentRound.state) {
      case Round.states.NOMINATION:
        return <NominationPhase round={currentRound} currentUser={user} nominate={this.nominate.bind(this)} />
      case Round.states.MISSION:
        return "mission"
      case Round.states.COMPLETE:
        return "complete"
      default:
        throw { message: "unrecognized round state" }
    }
  }

  render() {
    const { game: { currentRound } } = this.props
    const { operativeCount, requiredFailCount } = currentRound.missionInfo
    return (
      <div>
        <h2>Round {currentRound.roundNumber}</h2>
        <div style={{ margin: '5px', fontStyle: 'italic' }}>
          {operativeCount} operatives
          {requiredFailCount > 1 ? `; ${requiredFailCount} fails required` : ""}
        </div>
        <div>
          {
            this.isCurrentUserLeader()
            ? <span>You are the round leader.</span>
            : <span>{currentRound.currentLeader.name} is the round leader.</span>
          }
        </div>
        <div style={{ margin: '5px' }}>
          {this.renderCurrentRoundView()}
        </div>
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  const { game, secrets, user } = state.gameRoomStore;
  return {
    game: new Game(game, secrets),
    user: new User(user)
  };
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(roundPlayActionCreators, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(RoundPlayContainer);