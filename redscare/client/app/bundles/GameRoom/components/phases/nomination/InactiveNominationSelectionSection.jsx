import React, { PropTypes } from 'react';
import PlayerList from '../../PlayerList.jsx';
import Nomination from 'lib/game/nominationHelper';

class InactiveNominationSelectionSection extends React.Component {
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

export default InactiveNominationSelectionSection;