import React, { PropTypes } from 'react';
import _ from 'lodash';

export default class GameRoomContainer extends React.Component {
  static propTypes = {
    gameIndexPath: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    updateName: PropTypes.func.isRequired
  };

  constructor(props, context) {
    super(props, context);

    // Uses lodash to bind all methods to the context of the object instance, otherwise
    // the methods defined here would not refer to the component's class, not the component
    // instance itself.
    _.bindAll(this, 'handleChange');
  }

  handleChange(e) {
    const name = e.target.value;
    this.props.updateName(name);
  }

  render() {
    const { gameIndexPath, name } = this.props;
    return (
      <div>
        <h1>Game#show</h1>
        <p>Find me in app/views/game/show.html.erb</p>
        <div>
          <h2>Hello, {name}!</h2>
          <input type="text" value={name} onChange={this.handleChange} />
        </div>
        <hr/>
        <a href={gameIndexPath}>Back to games</a>
      </div>
    );
  }
}
