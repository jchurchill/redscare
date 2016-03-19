import React, { PropTypes } from 'react';
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
    return [1,2,3,4,5].map((i) => ({ roundNumber: i, info: existingRounds[i] }));
  }

  render() {
    const { game } = this.props
    const rounds = this.getAllRoundsInfo()
    if (!game.currentRound) {
      return <div></div>;
    }
    return (
      <div style={{ display: 'inline-block' }}>
        <div>
          {
            rounds.map((r) => 
              <div key={r.roundNumber} style={(()=>{
                const sharedStyle = { display: 'inline-block', margin: '5px', padding: '5px', border: '1px solid black', borderRadius: '3px' }
                if (!r.info) { return { ...sharedStyle, color: 'silver' } }
                let moreStyle;
                switch (r.info.outcome) {
                  case Round.outcomes.SUCCESS:
                    moreStyle = { color: 'blue', backgroundColor: 'cyan' }
                    break;
                  case Round.outcomes.FAILURE:
                  case Round.outcomes.OUT_OF_NOMINATIONS:
                    moreStyle = { color: 'red', backgroundColor: 'pink' }
                    break;
                  default:
                    moreStyle = { border: '3px solid black' }
                }
                return { ...sharedStyle, ...moreStyle }
              })()}>
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