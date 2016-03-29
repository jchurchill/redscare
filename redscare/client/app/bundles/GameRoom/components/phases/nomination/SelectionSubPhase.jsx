import React, { PropTypes } from 'react';

import ActiveSelectionSection from './ActiveSelectionSection';
import InactiveSelectionSection from './InactiveSelectionSection';

import Nomination from 'lib/game/nominationHelper';
import User from 'lib/game/userHelper';

class SelectionSubPhase extends React.Component {
  static PropTypes = {
    nomination: PropTypes.instanceOf(Nomination).isRequired,
    currentUser: PropTypes.instanceOf(User).isRequired,
    nominate: PropTypes.func.isRequired
  }

  constructor(props, context) {
    super(props, context);
  }

  render() {
    const { nomination, currentUser, nominate } = this.props
    const { leader, requiredNomineeCount, nominees } = nomination
    return (
      <div>
        <div style={{ fontStyle:'italic' }}>{nominees.length} out of {requiredNomineeCount} players nominated</div>
        <div style={{ margin: '10px' }}>{
          currentUser.id === leader.id
            ? <ActiveSelectionSection nomination={nomination} currentUser={currentUser} nominate={nominate} />
            : <InactiveSelectionSection nomination={nomination} currentUser={currentUser} />
        }</div>
      </div>
    );
  }
}

export default SelectionSubPhase;