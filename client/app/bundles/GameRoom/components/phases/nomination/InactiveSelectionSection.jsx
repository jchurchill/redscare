import React, { PropTypes } from 'react';
import cx from 'classnames';
import css from './SelectionSection.scss'

import PlayerIcon from '../../PlayerIcon'

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
    return (
      <div className={this.isPlayerNominated(p.id) ? css.selected : null}>
        <PlayerIcon player={p}/>
      </div>
    );
  }

  render() {
    const { nomination: { playerProvider: { players }, leader } } = this.props;
    const stillNominating = this.remainingNominations() > 0;
    return (
      <div>
        <div>{ stillNominating ? `${leader.name} is nominating.` : "Nomination complete." }</div>
        <div>
          { players.map(p =>
            <div key={p.id} className={cx(css.inline, css.participant)}>
              { this.renderPlayer(p) }
            </div>
          ) }
        </div>
      </div>
    );
  }
}

export default InactiveSelectionSection;