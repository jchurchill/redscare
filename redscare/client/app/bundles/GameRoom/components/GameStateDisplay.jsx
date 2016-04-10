import React, { PropTypes } from 'react';
import classnames from 'classnames';
import css from './GameStateDisplay.scss'
import GameRoundDisplay from './GameRoundDisplay';
import Game from 'lib/game/gameHelper';
import Round from 'lib/game/roundHelper';

class GameStateDisplay extends React.Component {
  static propTypes = {
    game: PropTypes.instanceOf(Game).isRequired
  };

  constructor(props, context) {
    super(props, context);
  }

  getAllRoundsInfo() {
    const { game } = this.props
    // dictionary: (round_number) => round info
    const existingRounds = game.rounds.reduce((rs, r) => { rs[r.roundNumber] = r; return rs; }, {})
    return [1,2,3,4,5].map((i) => ({
      roundNumber: i,
      info: existingRounds[i],
      classnames: this._getRoundClassnames(existingRounds[i])
    }));
  }

  _getRoundClassnames(roundInfo) {
    const cssClasses = [css.roundMarker];
    if (!roundInfo) {
      cssClasses.push(css.unstarted);
    }
    else {
      switch (roundInfo.outcome) {
        case Round.outcomes.SUCCESS:
          cssClasses.push(css.success);
          break;
        case Round.outcomes.FAILURE:
        case Round.outcomes.OUT_OF_NOMINATIONS:
          cssClasses.push(css.failure);
          break;
        default:
          cssClasses.push(css.active);
      }
    }
    return classnames(cssClasses);
  }

  render() {
    const { game } = this.props
    const rounds = this.getAllRoundsInfo()
    if (!game.currentRound) {
      return <div></div>;
    }
    return (
      <div>
        <div>
          {
            rounds.map((r) => 
              <div key={r.roundNumber} className={r.classnames} >
                Round {r.roundNumber}
              </div>
            )
          }
        </div>
        <GameRoundDisplay round={game.currentRound} />
      </div>
    );
  }
}

export default GameStateDisplay;