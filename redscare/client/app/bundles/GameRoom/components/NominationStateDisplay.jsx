import React, { PropTypes } from 'react';
import Nomination from 'lib/game/nominationHelper';

class NominationStateDisplay extends React.Component {
  static propTypes = {
    nomination: PropTypes.instanceOf(Nomination)
  };

  constructor(props, context) {
    super(props, context);
  }

  render() {
    const { nomination } = this.props;
    if (!nomination) { return (<div></div>); }
    return (
      <div style={{ marginTop: 10, textAlign: 'center' }}>
        <NominationStateTable nomination={nomination} />
      </div>
    );
  }
}

const NominationStateTable = props => {
  const { nomination } = props;
  const voting = nomination.state === Nomination.states.VOTING
  const complete = nomination.state === Nomination.states.COMPLETE
    
  return (
    <div>
      <table style={{ margin: 'auto' }}>
        <tbody>
          <NominationStateTableNomineesRow nomination={nomination} />
        </tbody>
      </table>
      { complete ? <NominationCompletionInfo nomination={nomination} /> : null }
    </div>
  );
}

const NominationStateTableNomineesRow = props => {
  const { nomination: { nominees, votes, leader, playerProvider: { players } } } = props;
  const nomineeProps = players.map(player => {
    const vote = votes.find(v => v.userId === player.id)
    return {
      player,
      isNominated: nominees.some(nom => nom.id === player.id),
      isLeader: player.id === leader.id,
      hasVoted: !!vote,
      upvote: vote && vote.upvote
    };
  })
  return (
    <tr>
      { nomineeProps.map(np => (<NominationStateTableNominee key={np.player.id} {...np} />)) }
    </tr>
  );
}

const NominationStateTableNominee = props => {
  const { player, isNominated, isLeader, hasVoted, upvote } = props;
  const style = { padding: 5 };

  // Bold when leader
  if (isLeader) { style.fontWeight = 'bold'; }

  // Underlined when nominated
  if (isNominated) { style.borderBottom = '3px solid #444444'; }

  // colored based on vote (gray while still secret)
  if (hasVoted && upvote === true) { style.backgroundColor = 'lightgreen'; }
  else if (hasVoted && upvote === false) { style.backgroundColor = 'lightpink'; }
  else if (hasVoted) { style.backgroundColor = 'lightgray'; }

  return (<td style={style}>{player.name}</td>);
}

const NominationCompletionInfo = props => {
  const { nomination: { state, outcome } } = props;
  if (state !== Nomination.states.COMPLETE) {
    return (<div></div>);
  }
  const result = { 
    text: outcome === Nomination.outcomes.ACCEPTED ? "accepted" : "rejected",
    style: outcome === Nomination.outcomes.ACCEPTED ? { backgroundColor: 'lightgreen' } : { backgroundColor: 'lightpink' }
  }
  return (
    <div style={{ border: '1px solid black', borderRadius: '5px', display: 'inline-block', margin: 5, padding: '2px 5px', fontWeight: 'bold', ...result.style }}>
      {result.text}
    </div>
  );
}

export default NominationStateDisplay;