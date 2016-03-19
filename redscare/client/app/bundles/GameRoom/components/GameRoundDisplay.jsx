import React, { PropTypes } from 'react';
import Round from 'lib/game/roundHelper';

class GameRoundDisplay extends React.Component {
  static propTypes = {
    round: PropTypes.instanceOf(Round).isRequired
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