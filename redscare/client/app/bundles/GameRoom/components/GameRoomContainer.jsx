import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as gameRoomActionCreators from '../actions/gameRoomActionCreators';
import PlayerWaitingRoom from '../components/PlayerWaitingRoom';

class GameRoomContainer extends React.Component {
  static propTypes = {
    actions: PropTypes.shape({
    }).isRequired,
    gameRoomStore: PropTypes.object.isRequired,
  };

  constructor(props, context) {
    super(props, context);
  }

  render() {
    const { name, gameIndexPath } = this.props.gameRoomStore
    return (
      <div>
        <h1>Game#show</h1>
        <p>Find me in app/views/game/show.html.erb</p>
        <hr/>
        <PlayerWaitingRoom />
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