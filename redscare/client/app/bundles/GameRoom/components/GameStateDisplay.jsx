import React, { PropTypes } from 'react';
import classnames from 'classnames';
import css from './GameStateDisplay.scss'
import RoundStateDisplay from './RoundStateDisplay';
import Game from 'lib/game/gameHelper';
import Round from 'lib/game/roundHelper';

class GameStateDisplay extends React.Component {
  static propTypes = {
    game: PropTypes.instanceOf(Game).isRequired
  };

  constructor(props, context) {
    super(props, context);
    this.state = { selectedRoundId: this.getDefaultSelectedRoundId() };
  }

  getDefaultSelectedRoundId() {
    const { game: { currentRound } } = this.props;
    return currentRound && currentRound.id;
  }

  onRoundMarkerClick(round) {
    if (round) {
      this.setState({ selectedRoundId: round.id });
    }
  }

  getAllRoundsInfo() {
    const { game } = this.props
    // dictionary: (round_number) => round info
    const existingRounds = game.rounds.reduce((rs, r) => { rs[r.roundNumber] = r; return rs; }, {})
    return [1,2,3,4,5].map((i) => ({
      roundNumber: i,
      round: existingRounds[i],
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
    const { game: { rounds } } = this.props
    if (!rounds.some(r => true)) {
      return (<div></div>);
    }
    const selectedRound = rounds.find(r => r.id === this.state.selectedRoundId)
    return (
      <div>
        <div>
          {
            this.getAllRoundsInfo().map((r) => 
              <div key={r.roundNumber} className={r.classnames} onClick={this.onRoundMarkerClick.bind(this, r.round)}>
                Round {r.roundNumber}
              </div>
            )
          }
        </div>
        <RoundStateDisplay round={selectedRound} />
      </div>
    );
  }
}

export default GameStateDisplay;