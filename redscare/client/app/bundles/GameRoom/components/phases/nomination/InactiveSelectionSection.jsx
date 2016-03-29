import React, { PropTypes } from 'react';
import PlayerList from '../../PlayerList.jsx';

import Nomination from 'lib/game/nominationHelper';
import User from 'lib/game/userHelper';

class InactiveSelectionSection extends React.Component {
  static PropTypes = {
    nomination: PropTypes.instanceOf(Nomination).isRequired,
    currentUser: PropTypes.instanceOf(User).isRequired
  }

  constructor(props, context) {
    super(props, context);
  }

  render() {
    return <div>InactiveSelectionSection</div>;
  }
}

export default InactiveSelectionSection;