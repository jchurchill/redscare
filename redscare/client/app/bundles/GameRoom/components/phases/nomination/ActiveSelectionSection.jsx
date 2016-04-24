import React, { PropTypes } from 'react';
import classNames from 'classnames';
import css from '../../PlayerList.scss'

import Nomination from 'lib/game/nominationHelper';
import User from 'lib/game/userHelper';

class ActiveSelectionSection extends React.Component {
  static PropTypes = {
    nomination: PropTypes.instanceOf(Nomination).isRequired,
    currentUser: PropTypes.instanceOf(User).isRequired,
    nominate: PropTypes.func.isRequired
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

  nominate(player) {
    if (this.remainingNominations() === 0) { return; }
    this.props.nominate(player.id);
  }

  renderPlayer(p) {
    const isPlayerNominated = this.isPlayerNominated(p.id);
    const remainingNominations = this.remainingNominations();
    const className = classNames(
      css.player,
      isPlayerNominated
        ? css.nominatedPlayer
        : (remainingNominations > 0 ? css.potentialNominatedPlayer : '')
    );
    const disabled = isPlayerNominated || remainingNominations === 0;
    const onClick = isPlayerNominated ? () => {} : this.nominate.bind(this, p)
    return (<button key={p.id} className={className} onClick={onClick} disabled={disabled}>{p.name}</button>);
  }

  render() {
    const { nomination: { playerProvider: { players } } } = this.props;
    const stillNominating = this.remainingNominations() > 0;
    return (
      <div>
        <div>{ stillNominating ? "Choose players to nominate." : "Nomination complete." }</div>
        <div>{ players.map(p => this.renderPlayer(p)) }</div>
      </div>
    );
  }
}

export default ActiveSelectionSection;