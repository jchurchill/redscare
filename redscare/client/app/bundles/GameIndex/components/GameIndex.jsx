import React, { PropTypes } from 'react';
import _ from 'lodash';

export default class GameIndex extends React.Component {
  constructor(props) {
    super(props);
    //this.state = ...;
  }

  render() {
    const { chatPath, newGamePath } = this.props
    return (
      <div className="container">
        <h1>Home#index</h1>
        <div>
          <a href={newGamePath}>Start a new game</a>
        </div>
        <div>
          <a href={chatPath}>Chat</a>
        </div>
      </div>
    );
  }
}
