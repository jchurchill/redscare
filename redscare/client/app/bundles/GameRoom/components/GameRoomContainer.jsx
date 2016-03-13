import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as gameRoomActionCreators from '../actions/gameRoomActionCreators';
import PlayerWaitingRoom from '../components/PlayerWaitingRoom';
import { gameStates } from '../constants/gameRoomConstants';

class GameRoomContainer extends React.Component {
  static propTypes = {
    actions: PropTypes.shape({
    }).isRequired,
    game: PropTypes.object.isRequired,
    gameIndexPath: PropTypes.string.isRequired
  };

  constructor(props, context) {
    super(props, context);
  }

  getGameView(game) {
    switch (game.state) {
      case gameStates.CREATED: return <PlayerWaitingRoom />
      default: return <div>{`View for game state '${game.state}' not yet implemented`}</div>
    }
  }

  render() {
    const { game, gameIndexPath } = this.props
    return (
      <div>
        <h1>{game.name}</h1>
        <div style={{fontStyle:"italic"}}>{game.player_count} players</div>
        <hr/>
          {this.getGameView(game)}
        <hr/>
        <a href={gameIndexPath}>Back to games</a>
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  const { game, gameIndexPath } = state.gameRoomStore
  return { game, gameIndexPath };
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(gameRoomActionCreators, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(GameRoomContainer);