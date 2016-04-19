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
  return (
    <div>
      <table style={{ margin: 'auto' }}>
        <tbody>
          <NominationStateTableNomineesRow nomination={nomination} />
          <NominationStateTableVotesRow nomination={nomination} />
        </tbody>
      </table>
      <NominationCompletionInfo nomination={nomination} />
    </div>
  );
}

const NominationStateTableNomineesRow = props => {
  const { nomination: { nominees, playerProvider: { players } } } = props;
  const columnInfos = players.map(player => ({
    player,
    isNominated: nominees.some(nom => nom.id === player.id)
  }))
  return (
    <tr>
      { columnInfos.map(columnInfo => (<NominationStateTableNominee key={columnInfo.player.id} {...columnInfo} />)) }
    </tr>
  );
}

const NominationStateTableNominee = props => {
  const { player, isNominated } = props;
  const style = isNominated ? { border: '2px solid black' } : {}
  return (
    <td style={{ padding: 5, ...style }}>
      {player.name}
    </td>
  );
}

const NominationStateTableVotesRow = props => {
  const { nomination: { votes, playerProvider: { players } } } = props;
  const columnInfos = players.map(player => {
    const vote = votes.find(v => v.userId === player.id);
    return { player, voted: !!vote, upvote: vote && vote.upvote };
  })
  return (
    <tr>
      { columnInfos.map(columnInfo => (<NominationStateTableVote key={columnInfo.player.id} {...columnInfo} />)) }
    </tr>
  );
}

const NominationStateTableVote = props => {
  const { player, voted, upvote } = props;
  const style =
    (voted && upvote === true) ? { backgroundColor: 'lightgreen' }
    : (voted && upvote === false) ? { backgroundColor: 'lightpink' }
    : (voted) ? { backgroundColor: 'lightgray' }
    : { }
  return (
    <td style={{ padding: 5, ...style }}>
      {player.name}
    </td>
  );
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