import React, { PropTypes } from 'react';
import PlayersJoiningContainer from '../containers/PlayersJoiningContainer';
import RoundPlayContainer from '../containers/RoundPlayContainer';
import AssassinationContainer from '../containers/AssassinationContainer';
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
      case Game.states.ASSASSINATION:
        return <AssassinationContainer />
      case Game.states.COMPLETE:
        return <div>This game is over.</div>
      case Game.states.CANCELLED:
        return <div>This game has been cancelled.</div>
      default:
        throw { message: `unrecognized game state ${state}` };
    }
  }

  renderRoleInfo() {
    const { game: { state, playerProvider, roleSecrets, specialRules} } = this.props
    // If game not started, display nothing
    if (state === Game.states.CREATED) {
      return <div></div>;
    }
    // If game started but role not assigned, then the current user is just a spectator
    else if (!roleSecrets.role) {
      return <div style={{ margin: '10px' }}>You are a spectator in this game.</div>;
    }
    else {
      return (
        <div style={{ margin: '10px' }}>
          <SecretRoleInfo roleSecrets={roleSecrets} specialRules={specialRules} playerProvider={playerProvider} />
        </div>
      )
    }
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