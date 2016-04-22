import React, { PropTypes } from 'react';

import Nomination from 'lib/game/nominationHelper';
import User from 'lib/game/userHelper';

class VotingSubPhase extends React.Component {
  static PropTypes = {
    nomination: PropTypes.instanceOf(Nomination).isRequired,
    currentUser: PropTypes.instanceOf(User).isRequired,
    vote: PropTypes.func.isRequired,
  }

  constructor(props, context) {
    super(props, context);
  }

  currentUserHasVoted() {
    const { currentUser: { id: userId }, nomination: { votes } } = this.props;
    return votes.some(v => v.userId === userId);
  }

  render() {
    return (
      <div>
        { this.currentUserHasVoted() ? null : <CastVoteSection castVote={this.props.vote} /> }
        <PlayerVotingInfo nomination={this.props.nomination} />
      </div>
    );
  }
}

class CastVoteSection extends React.Component {
  static PropTypes = {
    castVote: PropTypes.func.isRequired
  }

  render() {
    return (
      <div style={{ margin: 10 }}>
        <button onClick={this.props.castVote.bind(this, true)}>Upvote</button>
        <button onClick={this.props.castVote.bind(this, false)}>Downvote</button>
      </div>
    );
  }
}



const PlayerVotingInfo = props => {
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
      { nomineeProps.map(np => (<PlayerVote key={np.player.id} {...np} voteVisible={votesVisible} />)) }
    </div>
  );
}

const PlayerVote = props => {
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

export default VotingSubPhase;
