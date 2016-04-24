import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as roundPlayActionCreators from '../actions/roundPlayActionCreators';

import NominationPhase from '../components/phases/nomination/NominationPhase'
import MissionPhase from '../components/phases/mission/MissionPhase'

import Game from 'lib/game/gameHelper';
import Round from 'lib/game/roundHelper';
import User from 'lib/game/userHelper';
import websocket from 'lib/websocket/websocket';

class RoundPlayContainer extends React.Component {
  static propTypes = {
    game: PropTypes.instanceOf(Game).isRequired,
    user: PropTypes.instanceOf(User).isRequired,
    actions: PropTypes.shape({
      nominate: PropTypes.func.isRequired,
      vote: PropTypes.func.isRequired
    }).isRequired
  }

  constructor(props, context) {
    super(props, context);

    // Bind websocket events once in the constructor.
    // We need props for the game_id to know which channel to listen to.
    this._gameClient = websocket.gameClientFactory(props.game.id);
  }

  nominate(nomineeUserId) {
    const { game: { currentRound: { currentNomination } } } = this.props;
    this.props.actions.nominate(currentNomination.id, nomineeUserId);
    this._gameClient.trigger("game_room.nominate", {
      nomination_id: currentNomination.id,
      user_id: nomineeUserId,
    });
  }

  vote(upvote) {
    const { game: { currentRound: { currentNomination } }, user } = this.props;
    this.props.actions.vote(currentNomination.id, user.id, upvote);
    this._gameClient.trigger("game_room.vote", { upvote: upvote });
  }

  missionSubmit(pass) {
    const { game: { currentRound: { id: roundId } }, user: { id: userId } } = this.props;
    this.props.actions.missionSubmit(roundId, userId);
    this._gameClient.trigger("game_room.mission_submit", { pass });
  }

  renderCurrentRoundPhase() {
    const { game: { currentRound }, user } = this.props
    switch (currentRound.state) {
      case Round.states.NOMINATION:
        return <NominationPhase round={currentRound} currentUser={user} nominate={this.nominate.bind(this)} vote={this.vote.bind(this)} />
      case Round.states.MISSION:
        return <MissionPhase round={currentRound} currentUser={user} missionSubmit={this.missionSubmit.bind(this)} />
      case Round.states.COMPLETE:
        return "complete";
      default:
        throw { message: "unrecognized round state" };
    }
  }

  render() {
    const { game: { currentRound }, user } = this.props
    if (!currentRound) {
      return (
        <h2>Setting up first round...</h2>
      );
    }
    const { currentLeader, roundNumber, missionInfo: { operativeCount, requiredFailCount } } = currentRound
    return (
      <div>
        <div style={{ marginBottom: 15 }}>
          <div style={{ fontSize: 24, fontWeight: 'bold' }}>Round {roundNumber}</div>
          <div style={{ margin: '5px', fontStyle: 'italic' }}>
            {operativeCount} operatives
            {requiredFailCount > 1 ? `; ${requiredFailCount} fails required` : ""}
          </div>
        </div>
        <div style={{ margin: '5px' }}>
          { this.renderCurrentRoundPhase() }
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