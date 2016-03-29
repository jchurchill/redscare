import React, { PropTypes } from 'react';
import PlayerList from '../../PlayerList.jsx';
import Nomination from 'lib/game/nominationHelper';

class ActiveNominationSelectionSection extends React.Component {
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

export default ActiveNominationSelectionSection;