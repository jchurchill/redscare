import React, { PropTypes } from 'react';
import PlayersJoiningContainer from '../containers/PlayersJoiningContainer';
import RoundPlayContainer from '../containers/RoundPlayContainer';
import GameStateDisplay from './GameStateDisplay';
import SecretRoleInfo from '../components/SecretRoleInfo';
import Game from 'lib/game/gameHelper';

class GameRoom extends React.Component {
  static propTypes = {
    game: PropTypes.instanceOf(Game).isRequired
  };

  constructor(props, context) {
    super(props, context);
    console.log(props.game);
  }

  renderGameView(state) {
    switch (state) {
      case Game.states.CREATED:
        return <PlayersJoiningContainer />
      case Game.states.ROUNDS_IN_PROGRESS:
        return <RoundPlayContainer />
      default:
        return <div>{`View for game state '${state}' not yet implemented`}</div>
    }
  }

  renderRoleInfo() {
    const { game: { state, playerProvider, roleSecrets, specialRules, currentRound } } = this.props
    // Unless game in progress, roles will not yet be assigned
    if (state === Game.states.CREATED) { return ""; }
    return (
      <div style={{ margin: '10px' }}>
        <SecretRoleInfo roleSecrets={roleSecrets} specialRules={specialRules} playerProvider={playerProvider} />
      </div>
    )
  }

  render() {
    const { game } = this.props
    const specialRules = game.specialRules
    const roleSelections = [
      { text: "Seer & Assassin", enabled: specialRules.includesSeer },
      { text: "Seer-knower & False seer", enabled: specialRules.includesSeerDeception },
      { text: "Rogue evil", enabled: specialRules.includesRogueEvil },
      { text: "Evil master", enabled: specialRules.includesEvilMaster },
    ]
    return (
      <div>
        <h1>{name}</h1>
        <div style={{fontStyle:"italic"}}>{game.playerCount} players - {game.evilRoleCount} evil</div>
        <div style={{ marginTop: '20px' }}>
          <div style={{ display: 'inline-block', marginRight: '5px', fontWeight: 'bold' }}>Special roles:</div>
          <div style={{ display: 'inline-block' }}>
            {roleSelections.map((rs, i) => {
                const extraStyle = rs.enabled ? { border: '1px solid black' } : { border: '1px solid gray', color: 'silver' };
                return <div key={i} style={{ display: "inline-block", margin: '0 5px', padding: '5px', ...extraStyle }}>{rs.text}</div>
            })}
          </div>
          {this.renderRoleInfo()}
        </div>
        <hr/>
        {this.renderGameView(game.state)}
        <hr/>
        <GameStateDisplay game={game} />
        <hr/>
      </div>
    );
  }
}

export default GameRoom;