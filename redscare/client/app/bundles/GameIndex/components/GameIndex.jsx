import React, { PropTypes } from 'react';
import GameIndexGame from './GameIndexGame.jsx'

export default class GameIndex extends React.Component {
  constructor(props) {
    super(props);
    //this.state = ...;
  }

  render() {
    const { chatPath, newGamePath, games } = this.props
    return (
      <div className="container">
        <h1>Home#index</h1>
        <h2>Game creation</h2>
        <div>
          <a href={newGamePath}>Start a new game</a>
        </div>
        <h2>Existing games</h2>
        <div>
          <table style={{borderSpacing: "10px 0"}}>
            <thead style={{textAlign: "left"}}>
              <tr>
                <th>Game</th>
                <th>Created by</th>
                <th>Created at</th>
              </tr>
            </thead>
            <tbody>
              {games.map(game => (<GameIndexGame key={game.id} {...game} />))}
            </tbody>
          </table>
        </div>
        <h2>Other links</h2>
        <div>
          <a href={chatPath}>Chat</a>
        </div>
      </div>
    );
  }
}
