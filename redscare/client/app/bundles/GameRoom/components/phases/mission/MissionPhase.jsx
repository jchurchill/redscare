import React, { PropTypes } from 'react';

import Round from 'lib/game/roundHelper';
import User from 'lib/game/userHelper';

class MissionPhase extends React.Component {
  static PropTypes = {
    round: PropTypes.instanceOf(Round).isRequired,
    currentUser: PropTypes.instanceOf(User).isRequired,
    currentUserIsEvil: PropTypes.bool.isRequired,
    missionSubmit: PropTypes.func.isRequired,
  }

  constructor(props, context) {
    super(props, context);
  }

  currentUserOperative() {
    const { round: { operatives }, currentUser } = this.props
    return operatives.find(o => o.player.id === currentUser.id);
  }

  render() {
    const { round: { operatives }, missionSubmit } = this.props;
    const operative = this.currentUserOperative();
    return (
      <div>
        { operative ? <OperativeSubmissionOptions {...{ operative, missionSubmit, canFail: currentUserIsEvil }} /> : null }
        <PlayerSubmissionInfo operatives={operatives} />
      </div>
    );
  }
}

const OperativeSubmissionOptions = props => {
  const { operative: { submitted }, missionSubmit, canFail } = props;
  return (
    <div style={{ margin: 10 }}>
      <div style={{ marginBottom: 5 }}>{ !submitted ? "Place your submission." : "Thank you for submitting!" }</div>
      <button onClick={missionSubmit.bind(this, true)} disabled={submitted}>Pass</button>
      <button onClick={missionSubmit.bind(this, false)} disabled={submitted || !canFail}>Fail</button>
    </div>
  );
}

const PlayerSubmissionInfo = props => {
  const { operatives } = props;
  return (
    <div style={{ textAlign: 'center' }}>
      { operatives.map(op => (<PlayerSubmission key={op.player.id} {...op} />)) }
    </div>
  );
}

const PlayerSubmission = props => {
  const { player, submitted } = props;
  const style = { padding: 5, margin: '0 2px', display: 'inline-block' };

  // colored based on whether they submitted
  if (submitted) {
    style.backgroundColor = 'lightgray'
  }

  return (<div style={style}>{player.name}</div>);
}

export default MissionPhase;
