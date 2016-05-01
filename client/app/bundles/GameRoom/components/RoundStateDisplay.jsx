import React, { PropTypes } from 'react';

// CSS
import cx from 'classnames';
import css from './RoundStateDisplay.scss'

// Libraries / helpers
import Round from 'lib/game/roundHelper';

// Components
import Collapse from 'react-collapse';
import PlayerIcon from './PlayerIcon.jsx';

class RoundStateDisplay extends React.Component {
  static propTypes = {
    round: PropTypes.instanceOf(Round).isRequired
  };

  constructor(props) {
    super(props);
    this.state = { expanded: false };
  }

  getRoundCompletionType(round) {
    switch(round.outcome) {
      case Round.outcomes.SUCCESS:
        return "success";
      case Round.outcomes.FAILURE:
      case Round.outcomes.OUT_OF_NOMINATIONS:
        return "fail";
      default:
        return "incomplete";
    }
  }

  getRejectedNominations() {
    const { round: { nominations } } = this.props;
    return nominations
      // everything before the last (current) nomination
      .slice(0, nominations.length - 1)
      // order by nomination number desc
      .sort((n1, n2) => n2.nominationNumber - n1.nominationNumber)
  }

  roundDisplayClicked() {
    // toggle expanded
    const { expanded } = this.state;
    this.setState({ expanded: !expanded });
  }

  render() {
    const { round, round: { operatives, currentNomination } } = this.props;
    const { expanded } = this.state;
    const completionType = this.getRoundCompletionType(round);
    const previousNominations = this.getRejectedNominations();
    return (
      <div className={cx(css.round, css[completionType])}>
        <div onClick={() => this.roundDisplayClicked()}>
          <div className={cx(css.roundNumber, css.inline)}>{round.roundNumber}</div>
          <div className={css.inline} style={{ marginLeft: 30, minWidth: 700, textAlign: 'center' }}>
            <div style={{ verticalAlign: 'middle', width: '100%', position: 'relative', padding: '10px 0', borderBottom: '1px solid black' }}>
              { (round.outcome !== Round.outcomes.OUT_OF_NOMINATIONS)
                ? <OperativesDisplay operatives={operatives} />
                : <div className={cx(css.outOfNominations)}>Failure to coordinate</div>
              }
              <div className={css.roundLabel}>Operatives</div>
            </div>
            <div style={{ verticalAlign: 'middle', width: '100%', position: 'relative' }}>
              <div className={css.nominationLabel}>Nominations</div>
              <NominationStateDisplay nomination={currentNomination} />
            </div>
            <Collapse isOpened={expanded} keepCollapsedContent={true}>
              { previousNominations.some(() => true)
                ? previousNominations.map(nom =>
                    <div key={nom.nominationNumber} style={{ verticalAlign: 'middle', width: '100%' }}>
                      <NominationStateDisplay nomination={nom} />
                    </div>
                  )
                : <div style={{ verticalAlign: 'middle', width: '100%', fontStyle: 'italic', paddingTop: 10 }}>No rejected nominations</div>
              }
            </Collapse>
          </div>
        </div>
      </div>
    );
  }
}

const OperativesDisplay = (props) => {
  const { operatives } = props;
  return (
    <div>
      { operatives.map(operative =>
        <div key={operative.player.id} className={css.inline}>
          <PlayerIcon player={operative.player} />
        </div>
      ) }
    </div>
  );
}

const NominationStateDisplay = (props) => {
  const { nomination: nom } = props;
  const outcomeClass = css[nom.outcome];
  return (
    <div className={cx(css.nomination, outcomeClass)}>
      <div className={cx(css.nominationNumber, css.inline)}>{nom.nominationNumber}</div>
      { nom.participants.map(p => <NominationParticipant key={p.player.id} participant={p} />) }
    </div>
  );
};

const NominationParticipant = (props) => {
  const { participant: p } = props;
  const classes = [css.nominationParticipant];
  if (p.isLeader) { classes.push(css.leader); }
  if (p.isNominee) { classes.push(css.nominee); }
  if (p.upvote) { classes.push(css.upvote); }
  return (
    <div className={css.inline}>
      { p.isLeader ? <div className={css.leader}>* * *</div> : null }
      <div className={cx(classes)} style={{fontSize:'xx-small'}}>
        <div className={css.icon}>
          <PlayerIcon player={p.player} imgWidth={40} />
        </div>
      </div>
    </div>
  );
};

export default RoundStateDisplay;