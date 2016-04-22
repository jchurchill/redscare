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

    const voting = nomination.state === Nomination.states.VOTING
    const complete = nomination.state === Nomination.states.COMPLETE
      
    return (
      <div style={{ marginTop: 10, textAlign: 'center' }}>
        <NomineeList nomination={nomination} />
        <NominationCompletionInfo nomination={nomination} />
      </div>
    );
  }
}

const NomineeList = props => {
  const { nomination: { state, nominees, votes, leader, playerProvider: { players } } } = props;
  const votesVisible = state === Nomination.states.COMPLETE;
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
    <div style={{ textAlign: 'center' }}>
      { nomineeProps.map(np => (<Nominee key={np.player.id} {...np} voteVisible={votesVisible} />)) }
    </div>
  );
}

const Nominee = props => {
  const { player, isNominated, isLeader, hasVoted, upvote, voteVisible } = props;
  const style = { padding: 5, margin: '0 2px', display: 'inline-block' };

  // Bold when leader
  if (isLeader) { style.fontWeight = 'bold'; }

  // Underlined when nominated
  if (isNominated) { style.borderBottom = '3px solid #444444'; }

  // colored based on vote (gray while still secret)
  if (hasVoted) {
    if (!voteVisible) { style.backgroundColor = 'lightgray'; }
    else if (upvote === true) { style.backgroundColor = 'lightgreen'; }
    else if (upvote === false) { style.backgroundColor = 'lightpink'; }  
  }

  return (<div style={style}>{player.name}</div>);
}

const NominationCompletionInfo = props => {
  const { nomination: { state, outcome } } = props;
  const text =
    outcome === Nomination.outcomes.ACCEPTED ? "accepted" :
    outcome === Nomination.outcomes.REJECTED ? "rejected" :
    "in progress";

  const color =
    outcome === Nomination.outcomes.ACCEPTED ? "lightgreen" :
    outcome === Nomination.outcomes.REJECTED ? "lightpink" :
    "lightgray";

  return (
    <div style={{ border: '1px solid black', borderRadius: '5px', display: 'inline-block', margin: 5, padding: '2px 5px', fontWeight: 'bold', backgroundColor: color }}>
      {text}
    </div>
  );
}

export default NominationStateDisplay;