import React, { PropTypes } from 'react';
import css from './GameStateDisplay.scss'
import RoundStateDisplay from './RoundStateDisplay';
import Game from 'lib/game/gameHelper';

class GameStateDisplay extends React.Component {
  static propTypes = {
    game: PropTypes.instanceOf(Game).isRequired
  };

  getCompletedRounds() {
    const { game: { rounds } } = this.props;
    return rounds
      // only completed rounds
      //.filter(r => r.outcome !== null)
      // Order rounds descending by round number
      .sort((r1, r2) => r2.roundNumber - r1.roundNumber);
  }

  render() {
    const rounds = this.getCompletedRounds();
    return (
      <div>
        { rounds.map(round => <RoundStateDisplay key={round.roundNumber} round={round} />) }
      </div>
    );
  }
}

export default GameStateDisplay;