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
        <div>Current status: {round.state}</div>
      </div>
    );
  }
}

export default GameRoundDisplay;