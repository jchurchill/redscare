import React, { PropTypes } from 'react';
import { roundOutcomes } from '../constants/gameRoomConstants'
import GameRoundDisplay from './GameRoundDisplay';

class GameStateDisplay extends React.Component {
  static propTypes = {
    game: PropTypes.object.isRequired
  };

  constructor(props, context) {
    super(props, context);
  }

  getGameStateInfo() {
    const { game } = this.props
    const gameRounds = (game.rounds || [])
    // dictionary: (round_number) => round info
    const existingRounds = gameRounds.reduce((rs, r) => { rs[r.round_number] = r; return rs; }, {})
    const allRounds = [1,2,3,4,5].map((i) => ({ roundNumber: i, info: existingRounds[i] }));
    return {
      currentRoundInfo : existingRounds[gameRounds.length],
      rounds: allRounds
    }
  }

  render() {
    const { currentRoundInfo, rounds } = this.getGameStateInfo()
    if (!currentRoundInfo) {
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
                var moreStyle;
                switch (r.info.outcome) {
                  case roundOutcomes.SUCCESS:
                    moreStyle = { color: 'blue', backgroundColor: 'cyan' }
                    break;
                  case roundOutcomes.FAILURE:
                  case roundOutcomes.OUT_OF_NOMINATIONS:
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
        <GameRoundDisplay round={currentRoundInfo} />
      </div>
    );
  }
}

export default GameStateDisplay;