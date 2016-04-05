import React, { PropTypes } from 'react';

import SelectionSubPhase from './SelectionSubPhase';
import VotingSubPhase from './VotingSubPhase';

import Nomination from 'lib/game/nominationHelper';
import Round from 'lib/game/roundHelper';
import User from 'lib/game/userHelper';

class NominationPhase extends React.Component {
  static PropTypes = {
    round: PropTypes.instanceOf(Round).isRequired,
    currentUser: PropTypes.instanceOf(User).isRequired,
    nominate: PropTypes.func.isRequired,
    vote: PropTypes.func.isRequired,
  }

  constructor(props, context) {
    super(props, context);
  }

  renderSubPhase() {
    const { round: { currentNomination }, currentUser, nominate, vote } = this.props
    switch (currentNomination.state) {
      case Nomination.states.SELECTING:
        return <SelectionSubPhase nomination={currentNomination} currentUser={currentUser} nominate={nominate} />
      case Nomination.states.VOTING:
        return <VotingSubPhase nomination={currentNomination} currentUser={currentUser} vote={vote} />
      case Nomination.states.COMPLETE:
        return "complete"
      default:
        throw { message: "unrecognized nomination state", state }
    }
  }

  render() {
    const { currentNomination } = this.props.round
    if (!currentNomination) {
      return (
        <h3>Setting up first nomination...</h3>
      );
    }
    return (
      <div>
        <h3>Nomination {currentNomination.nominationNumber}</h3>
        { this.renderSubPhase() }
      </div>
    );
  }
}

export default NominationPhase;