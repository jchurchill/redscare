import React, { PropTypes } from 'react';
import Round from 'lib/game/roundHelper';
import NominationStateDisplay from './NominationStateDisplay.jsx';

class RoundStateDisplay extends React.Component {
  static propTypes = {
    round: PropTypes.instanceOf(Round).isRequired
  };

  constructor(props, context) {
    super(props, context);
  }

  render() {
    const { round: { state, currentNomination } } = this.props;
    return (
      <div>
        <div>Current status: {state}</div>
        <NominationStateDisplay nomination={currentNomination} />
      </div>
    );
  }
}

export default RoundStateDisplay;