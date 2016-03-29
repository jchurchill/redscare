import React, { PropTypes } from 'react';

import ActiveNominationSelectionSection from './ActiveNominationSelectionSection'
import InactiveNominationSelectionSection from './InactiveNominationSelectionSection'

import Round from 'lib/game/roundHelper';
import User from 'lib/game/userHelper';

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
            ? <ActiveNominationSelectionSection nomination={currentNomination} operativeCount={operativeCount} nominate={nominate} />
            : <InactiveNominationSelectionSection nomination={currentNomination} operativeCount={operativeCount} />
        }</div>
      </div>
    );
  }
}

export default NominationPhase;