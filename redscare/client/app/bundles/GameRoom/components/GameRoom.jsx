import React, { PropTypes } from 'react';
import PlayersJoining from './PlayersJoining';
import RoundPlay from './RoundPlay';
import Assassination from './Assassination';
import ConnectionStatusDisplay from './ConnectionStatusDisplay';
import GameStateDisplay from './GameStateDisplay';
import GameStateDisplay2 from './GameStateDisplay2';
import SecretRoleInfo from './SecretRoleInfo';
import Game from 'lib/game/gameHelper';
import User from 'lib/game/userHelper';

class GameRoom extends React.Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    connectionState: PropTypes.string.isRequired,
    game: PropTypes.instanceOf(Game).isRequired,
    user: PropTypes.instanceOf(User).isRequired,
    links: PropTypes.shape({
      games: PropTypes.string.isRequired,
      host: PropTypes.string.isRequired
    }).isRequired
  };

  renderGameView(state) {
    const { game, user, actions } = this.props;
    switch (state) {
      case Game.states.CREATED:
        return <PlayersJoining game={game} user={user} actions={actions} />
      case Game.states.ROUNDS_IN_PROGRESS:
        return <RoundPlay game={game} user={user} actions={actions} />
      case Game.states.ASSASSINATION:
        return <Assassination game={game} user={user} actions={actions} />
      case Game.states.COMPLETE:
        return <div>This game is over.</div>
      case Game.states.CANCELLED:
        return <div>This game has been cancelled.</div>
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
    const { game, links, connectionState } = this.props
    const specialRules = game.specialRules
    const roleSelections = [
      { text: "Seer & Assassin", enabled: specialRules.includesSeer },
      { text: "Seer-knower & False seer", enabled: specialRules.includesSeerDeception },
      { text: "Rogue evil", enabled: specialRules.includesRogueEvil },
      { text: "Evil master", enabled: specialRules.includesEvilMaster },
    ]
    return (
      <div style={{ textAlign: 'center' /* center everything! */ }}>
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
        <GameStateDisplay2 game={game} />
        <hr/>
        <div>
          <a href={links.games}>Back to games</a>
        </div>
        <ConnectionStatusDisplay connectionState={connectionState} />
      </div>
    );
  }
}

export default GameRoom;