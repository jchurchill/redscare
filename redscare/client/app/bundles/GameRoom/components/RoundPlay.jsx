import React, { PropTypes } from 'react';

import NominationPhase from '../components/phases/nomination/NominationPhase.jsx'
import MissionPhase from '../components/phases/mission/MissionPhase.jsx'

import Game from 'lib/game/gameHelper';
import Round from 'lib/game/roundHelper';
import User from 'lib/game/userHelper';

class RoundPlay extends React.Component {
  static propTypes = {
    game: PropTypes.instanceOf(Game).isRequired,
    user: PropTypes.instanceOf(User).isRequired,
    actions: PropTypes.shape({
      nominate: PropTypes.func.isRequired,
      vote: PropTypes.func.isRequired
    }).isRequired
  }

  nominate(nomineeUserId) {
    const { actions, game: { currentRound: { currentNomination } } } = this.props;
    actions.nominate(currentNomination.id, nomineeUserId);
  }

  vote(upvote) {
    const { actions, game: { currentRound: { currentNomination } }, user } = this.props;
    actions.vote(currentNomination.id, user.id, upvote);
  }

  missionSubmit(pass) {
    const { actions, game: { currentRound }, user } = this.props;
    actions.missionSubmit(currentRound.id, user.id, pass);
  }

  renderCurrentRoundPhase() {
    const { game: { currentRound, currentUserIsEvil }, user } = this.props
    switch (currentRound.state) {
      case Round.states.NOMINATION:
        return <NominationPhase
          round={currentRound}
          currentUser={user}
          nominate={this.nominate.bind(this)}
          vote={this.vote.bind(this)}
          />
      case Round.states.MISSION:
        return <MissionPhase
          round={currentRound}
          currentUser={user}
          missionSubmit={this.missionSubmit.bind(this)}
          currentUserIsEvil={currentUserIsEvil}
          />
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

export default RoundPlay;