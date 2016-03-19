import React, { PropTypes } from 'react';
import PlayersJoiningContainer from '../containers/PlayersJoiningContainer';
import RoundPlayContainer from '../containers/RoundPlayContainer';
import GameStateDisplay from './GameStateDisplay';
import { gameStates } from '../constants/gameRoomConstants';
import { getEvilRoleCount } from 'lib/game/gameRules';

class GameRoom extends React.Component {
  static propTypes = {
    game: PropTypes.object.isRequired
  };

  constructor(props, context) {
    super(props, context);
    console.log(props.game);
  }

  getGameView(game) {
    switch (game.state) {
      case gameStates.CREATED:
        return <PlayersJoiningContainer />
      case gameStates.ROUNDS_IN_PROGRESS:
        return <RoundPlayContainer />
      default:
        return <div>{`View for game state '${game.state}' not yet implemented`}</div>
    }
  }

  render() {
    const { game } = this.props
    const playerCount = game.player_count
    const roleSelections = [
      { text: "Seer & Assassin", enabled: game.includes_seer },
      { text: "Seer-knower & False seer", enabled: game.includes_seer_deception },
      { text: "Rogue evil", enabled: game.includes_rogue_evil },
      { text: "Evil master", enabled: game.includes_evil_master },
    ]
    return (
      <div>
        <h1>{game.name}</h1>
        <div style={{fontStyle:"italic"}}>{playerCount} players - {getEvilRoleCount(playerCount)} evil</div>
        <div style={{ marginTop: '20px' }}>
          <div style={{ display: 'inline-block', marginRight: '5px', fontWeight: 'bold' }}>Special roles:</div>
          <div style={{ display: 'inline-block' }}>
            {roleSelections.map((rs, i) => {
                const extraStyle = rs.enabled ? { border: '1px solid black' } : { border: '1px solid gray', color: 'silver' };
                return <div key={i} style={{ display: "inline-block", margin: '0 5px', padding: '5px', ...extraStyle }}>{rs.text}</div>
            })}
          </div>
        </div>
        <hr/>
        {this.getGameView(game)}
        <hr/>
        <GameStateDisplay game={game} />
        <hr/>
      </div>
    );
  }
}

export default GameRoom;