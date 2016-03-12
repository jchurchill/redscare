import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as gameRoomActionCreators from '../actions/gameRoomActionCreators';

class GameRoomContainer extends React.Component {
  static propTypes = {
    actions: PropTypes.shape({
      updateName: PropTypes.func.isRequired
    }).isRequired,
    gameRoomStore: PropTypes.object.isRequired,
  };

  constructor(props, context) {
    super(props, context);
  }

  handleChange(e) {
    const name = e.target.value;
    this.props.actions.updateName(name);
  }

  render() {
    const { name, gameIndexPath } = this.props.gameRoomStore
    return (
      <div>
        <h1>Game#show</h1>
        <p>Find me in app/views/game/show.html.erb</p>
        <div>
          <h2>Hello, {name}!</h2>
          <input type="text" value={name} onChange={this.handleChange.bind(this)} />
        </div>
        <hr/>
        <a href={gameIndexPath}>Back to games</a>
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  return { gameRoomStore: state.gameRoomStore };
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(gameRoomActionCreators, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(GameRoomContainer);