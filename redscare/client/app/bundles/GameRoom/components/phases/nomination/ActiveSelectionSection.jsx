import React, { PropTypes } from 'react';
import cx from 'classnames';
import css from './SelectionSection.scss'

import PlayerIcon from '../../PlayerIcon.jsx'
import Collapse from 'react-collapse';

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

  render() {
    const { nomination: { playerProvider: { players } } } = this.props;
    const stillNominating = this.remainingNominations() > 0;
    return (
      <div>
        <div>{ stillNominating ? "Choose players to nominate." : "Nomination complete." }</div>
        <div>
          { players.map(p =>
            <div key={p.id} className={css.inline} style={{ verticalAlign: 'top' }}>
              <NominationParticipant
                player={p}
                selected={this.isPlayerNominated(p.id)}
                disabled={this.remainingNominations() === 0}
                onSelect={() => this.nominate(p)}
              />
            </div>
          ) }
        </div>
      </div>
    );
  }
}

class NominationParticipant extends React.Component {
  static propTypes = {
    player: PropTypes.instanceOf(User).isRequired,
    selected: PropTypes.bool,
    disabled: PropTypes.bool,
    onSelect: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.state = { staged: false }
  }

  toggleStaged() {
    // only allow staging when not selected or disabled
    const { selected, disabled } = this.props;
    if (selected || disabled) { return; }
    const { staged } = this.state;
    this.setState({ staged: !staged });
  }

  confirmed() {
    const { selected, disabled, onSelect } = this.props;
    if (onSelect) { onSelect(); }
    this.setState({ staged: false });
  }

  render() {
    const { player, selected, disabled } = this.props;
    const { staged } = this.state; 
    return (
      <div className={css.participant}>
        <div onClick={() => this.toggleStaged()} className={selected ? css.selected : disabled ? css.disabled : css.selectable}>
          <PlayerIcon player={player} />
        </div>
        <Collapse isOpened={staged} keepCollapsedContent={true} springConfig={{stiffness: 200, damping: 20}}>
          <div onClick={() => this.confirmed()} className={css.nominate}>Nominate</div>
        </Collapse>
      </div>
    );
  }
}

export default ActiveSelectionSection;