import React, { PropTypes } from 'react';

import cx from 'classnames';
import css from './VotingSubPhase.scss'

import PlayerIcon from '../../PlayerIcon.jsx'

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
        <CastVoteSection castVote={this.props.vote} hasVoted={this.currentUserHasVoted()}/>
        <PlayerVotingInfo nomination={this.props.nomination} />
      </div>
    );
  }
}

class CastVoteSection extends React.Component {
  static PropTypes = {
    castVote: PropTypes.func.isRequired,
    hasVoted: PropTypes.bool.isRequired
  }

  render() {
    const { castVote, hasVoted } = this.props
    return (
      <div style={{ margin: 10 }}>
        <div style={{ marginBottom: 5 }}>{ !hasVoted ? "Place your vote." : "Thank you for voting!" }</div>
        <button onClick={castVote.bind(this, true)} disabled={hasVoted}>Upvote</button>
        <button onClick={castVote.bind(this, false)} disabled={hasVoted}>Downvote</button>
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
  const classes = [css.playerVote];

  if (isLeader) { classes.push(css.leader) }
  if (isNominated) { classes.push(css.nominated) }
  if (hasVoted) {
    if (!voteVisible) { classes.push(css.voted) }
    else if (upvote === true) { classes.push(css.upvoted) }
    else if (upvote === false) { classes.push(css.downvoted) }  
  }

  return (<div className={cx(classes)}><PlayerIcon player={player}/></div>);
}

export default VotingSubPhase;
