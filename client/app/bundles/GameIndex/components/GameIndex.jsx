import React, { PropTypes } from 'react';
import GameIndexGame from './GameIndexGame.jsx'

class GameIndex extends React.Component {
  static PropTypes = {
    chatPath: PropTypes.string.isRequired,
    devPanelPath: PropTypes.string.isRequired,
    newGamePath: PropTypes.string.isRequired,
    unstartedGames: React.PropTypes.array.isRequired,
    yourGames: React.PropTypes.array.isRequired,
  }

  constructor(props) {
    super(props);
  }

  render() {
    const { chatPath, devPanelPath, newGamePath, unstartedGames, yourGames } = this.props
    return (
      <div className="container">
        <h1>Games#index</h1>
        <h2>Game creation</h2>
        <div>
          <a href={newGamePath}>Start a new game</a>
        </div>
        <GameIndexTable title="All unstarted games" games={unstartedGames} />
        <GameIndexTable title="Your games" games={yourGames} />
        <h2>Other links</h2>
        <div><a href={chatPath}>Chat</a></div>
        <div><a href={devPanelPath}>Dev panel</a></div>
      </div>
    );
  }
}

class GameIndexTable extends React.Component {
  static PropTypes = {
    title: PropTypes.string.isRequired,
    games: PropTypes.array.isRequired
  }

  constructor(props) {
    super(props);
  }

  render() {
    const { title, games } = this.props
    return (
      <div>
        <h2>{title}</h2>
        <table style={{borderSpacing: "10px 0"}}>
          <thead style={{textAlign: "left"}}>
            <tr><th>Game</th><th>Created by</th><th>Created at</th></tr>
          </thead>
          <tbody>
            { games.map(game => (<GameIndexGame key={game.id} {...game} />)) }
          </tbody>
        </table>
      </div>
    );
  }
}

export default GameIndex