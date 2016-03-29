import React, { PropTypes } from 'react';

import Round from 'lib/game/roundHelper';
import User from 'lib/game/userHelper';

class MissionPhase extends React.Component {
  static PropTypes = {
    round: PropTypes.instanceOf(Round).isRequired,
    submit: PropTypes.func.isRequired,
  }

  constructor(props, context) {
    super(props, context);
  }

  render() {
    return <div>MissionPhase</div>;
  }
}

export default MissionPhase;
