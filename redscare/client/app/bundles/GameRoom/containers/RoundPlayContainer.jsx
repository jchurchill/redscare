import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as roundPlayActionCreators from '../actions/roundPlayActionCreators';
import Game from 'lib/game/gameHelper';
import Round from 'lib/game/roundHelper';
import Nomination from 'lib/game/nominationHelper';
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

// TODO: move the below components out of this file once done iterating

class NominationPhase extends React.Component {
  static PropTypes = {
    round: PropTypes.instanceOf(Round).isRequired,
    currentUser: PropTypes.instanceOf(User).isRequired,
    nominate: PropTypes.func.isRequired
  }

  constructor(props, context) {
    super(props, context);
  }

  isCurrentUserLeader() {
    const { round: { currentLeader }, currentUser } = this.props
    return currentLeader.id === currentUser.id
  }

  render() {
    const { round: { currentNomination, missionInfo: { operativeCount, requiredFailCount } }, nominate } = this.props
    const { nominationNumber, nominees } = currentNomination
    const isCurrentUserLeader = this.isCurrentUserLeader()
    return (
      <div>
        <h3>Nomination {nominationNumber}</h3>
        <div style={{ fontStyle:'italic' }}>{nominees.length} out of {operativeCount} players nominated</div>
        <div style={{ margin: '10px' }}>{
          isCurrentUserLeader
            ? <LeaderNominationPhase nomination={currentNomination} operativeCount={operativeCount} nominate={nominate} />
            : <NonLeaderNominationPhase nomination={currentNomination} operativeCount={operativeCount} />
        }</div>
      </div>
    );
  }
}

//export default NominationPhase;

class LeaderNominationPhase extends React.Component {
  static PropTypes = {
    nomination: PropTypes.instanceOf(Nomination).isRequired,
    operativeCount: PropTypes.number.isRequired,
    nominate: PropTypes.func.isRequired
  }

  constructor(props, context) {
    super(props, context);
  }

  render() {
    return <div>LeaderNominationPhase</div>;
  }
}

//export default LeaderNominationPhase;

class NonLeaderNominationPhase extends React.Component {
  static PropTypes = {
    nomination: PropTypes.instanceOf(Nomination).isRequired,
    operativeCount: PropTypes.number.isRequired
  }

  constructor(props, context) {
    super(props, context);
  }

  render() {
    return <div>NonLeaderNominationPhase</div>;
  }
}

//export default NonLeaderNominationPhase;



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