import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as gameRoomActionCreators from '../actions/gameRoomActionCreators';
import PlayerWaitingRoom from './PlayerWaitingRoom';
import GameStateDisplay from './GameStateDisplay';
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
    console.log(props.game);
  }

  getGameView(game) {
    switch (game.state) {
      case gameStates.CREATED: return <PlayerWaitingRoom />
      default: return <div>{`View for game state '${game.state}' not yet implemented`}</div>
    }
  }

  getEvilCount(playerCount) {
    return { 5: 2, 6: 2, 7: 3, 8: 3, 9: 4, 10: 4 }[playerCount];
  }

  render() {
    const { game, gameIndexPath } = this.props
    const playerCount = game.player_count
    const roleSelections = [
      { text: "Seer & Assassin", enabled: game.includes_seer },
      { text: "Seer-knower & False seer", enabled: game.includes_seer_deception },
      { text: "Rogue evil", enabled: game.includes_rogue_evil },
      { text: "Evil master", enabled: game.includes_evil_master },
    ]
    return (
      <div>
        <h1>{game.name}</h1>
        <div style={{fontStyle:"italic"}}>{playerCount} players - {this.getEvilCount(playerCount)} evil</div>
        <div>
          <h4>Included special roles</h4>
          <div>
            {roleSelections.map((rs, i) => {
                const extraStyle = rs.enabled ? { border: '1px solid black' } : { border: '1px solid gray', color: 'silver' };
                return <div key={i} style={{ display: "inline-block", margin: '0 5px', padding: '5px', ...extraStyle }}>{rs.text}</div>
            })}
          </div>
        </div>
        <hr/>
        {this.getGameView(game)}
        <hr/>
        <GameStateDisplay game={game} />
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