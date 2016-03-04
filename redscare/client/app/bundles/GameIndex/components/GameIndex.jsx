import React, { PropTypes } from 'react';
import _ from 'lodash';

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
          {
            games.map(g => (<div key={g.id}><a href={g.path}>{JSON.stringify(g)}</a></div>))
          }
        </div>
        <h2>Other links</h2>
        <div>
          <a href={chatPath}>Chat</a>
        </div>
      </div>
    );
  }
}
