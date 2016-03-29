import React, { PropTypes } from 'react';

import Nomination from 'lib/game/nominationHelper';
import User from 'lib/game/userHelper';

class VotingSubPhase extends React.Component {
  static PropTypes = {
    nomination: PropTypes.instanceOf(Nomination).isRequired,
    currentUser: PropTypes.instanceOf(User).isRequired,
    vote: PropTypes.func.isRequired,
  }

  constructor(props, context) {
    super(props, context);
  }

  render() {
    return <div>VotingSubPhase</div>;
  }
}

export default VotingSubPhase;
