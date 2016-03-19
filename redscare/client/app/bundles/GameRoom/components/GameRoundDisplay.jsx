import React, { PropTypes } from 'react';
import { roundOutcomes } from '../constants/gameRoomConstants'

class GameRoundDisplay extends React.Component {
  static propTypes = {
    round: PropTypes.object.isRequired
  };

  constructor(props, context) {
    super(props, context);
  }

  render() {
    const { round } = this.props
    return (
      <div style={{ textAlign: 'center' }}>
        Round {round.round_number}
      </div>
    );
  }
}

export default GameRoundDisplay;