import React, { PropTypes } from 'react';
import css from './GameStateDisplay.scss'
import RoundStateDisplay from './RoundStateDisplay2';
import Game from 'lib/game/gameHelper';

class GameStateDisplay extends React.Component {
  static propTypes = {
    game: PropTypes.instanceOf(Game).isRequired
  };

  getRounds() {
    const { game: { rounds } } = this.props;
    // Order rounds descending by round number
    return rounds.sort((r1, r2) => r2.roundNumber - r1.roundNumber);
  }

  render() {
    const rounds = this.getRounds();
    return (
      <div style={{ textAlign: 'left' }}> {/* TODO: remove style tag */}
        { rounds.map(round => <RoundStateDisplay key={round.roundNumber} round={round} />) }
      </div>
    );
  }
}

export default GameStateDisplay;