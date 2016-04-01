import React, { PropTypes } from 'react';
import classNames from 'classnames';
import css from '../../PlayerList.scss'

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

  isPlayerNominated(userId) {
    const { nomination, currentUser } = this.props;
    return nomination.nominees.some(p => p.id === userId);
  }

  remainingNominations() {
    const { nomination: { nominees, requiredNomineeCount } } = this.props;
    return requiredNomineeCount - nominees.length;
  }

  renderPlayer(p) {
    const isPlayerNominated = this.isPlayerNominated(p.id);
    const className = classNames(
      css.player,
      isPlayerNominated ? css.nominatedPlayer : ''
    );
    return (<div key={p.id} className={className}>{p.name}</div>);
  }

  render() {
    const { nomination: { playerProvider: { players } } } = this.props;
    const stillNominating = this.remainingNominations() > 0;
    return (
      <div>
        <div>{ stillNominating ? "The round leader is nominating." : "Nomination complete." }</div>
        <div>{ players.map(p => this.renderPlayer(p)) }</div>
      </div>
    );
  }
}

export default InactiveSelectionSection;