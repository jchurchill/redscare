import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as roundPlayActionCreators from '../actions/roundPlayActionCreators';

import Game from 'lib/game/gameHelper';
import { getRoleTitle } from 'lib/game/gameRules';
import User from 'lib/game/userHelper';
import websocket from 'lib/websocket/websocket';

class AssassinationContainer extends React.Component {
  static propTypes = {
    game: PropTypes.instanceOf(Game).isRequired,
    user: PropTypes.instanceOf(User).isRequired,
    actions: PropTypes.shape({
      selectAssassinTarget: PropTypes.func.isRequired
    }).isRequired
  }

  constructor(props, context) {
    super(props, context);

    // Bind websocket events once in the constructor.
    // We need props for the game_id to know which channel to listen to.
    this._gameClient = websocket.gameClientFactory(props.game.id);
  }

  selectAssassinTarget(targetUserId) {
    this.props.actions.selectAssassinTarget(targetUserId);
    this._gameClient.trigger("game_room.select_assassin_target", {
      target_user_id: targetUserId
    });
  }

  getAssassinPlayer() {
    const { game: { assassinationRoleInfo } } = this.props
    return assassinationRoleInfo.evils.find(ev => ev.role === Game.roles.ASSASSIN).player;
  }

  render() {
    const { game: { assassinatedPlayer, assassinationRoleInfo: { goods, evils } }, user } = this.props
    const assassin = this.getAssassinPlayer();
    return (
      <div>
        <div style={{margin:10}}>
          { assassin.id === user.id
            ?
            <AssassinationOptions goods={goods} selectAssassinTarget={this.selectAssassinTarget.bind(this)} assassinatedPlayer={assassinatedPlayer} />
            :
            <div>{assassin.name} will now assassinate one good player.</div>
          }
        </div>
        <PlayerRoleInfo goods={goods} evils={evils} />
      </div>
    );
  }
}

const AssassinationOptions = props => {
  const { selectAssassinTarget, goods, assassinatedPlayer } = props;
  const selectionMade = !!assassinatedPlayer;
  return (
    <div>
      <div style={{ marginBottom: 5 }}>{ !selectionMade ? "Choose a player to assassinate." : "Player assassinated!" }</div>
      { goods.map(g => <button key={g.player.id} onClick={selectAssassinTarget.bind(null, g.player.id)} disabled={selectionMade}>{g.player.name}</button>) }
    </div>
  );
}

const PlayerRoleInfo = props => {
  const { goods, evils } = props;
  return (
    <div style={{ textAlign: 'center' }}>
      <div>
        { evils.map(pl => (<PlayerRole key={pl.player.id} player={pl.player} isEvil={true} role={pl.role} />)) }
      </div>
      <div style={{ marginTop: 10 }}>
        { goods.map(pl => (<PlayerRole key={pl.player.id} player={pl.player} isEvil={false} />)) }
      </div>
    </div>
  );
}

const PlayerRole = props => {
  const { player, isEvil, role } = props;
  const roleTitle = role ? getRoleTitle(role) : "?";
  const style = { padding: 5, margin: '0 2px', display: 'inline-block' };

  // colored based on allegiance
  style.backgroundColor = isEvil ? 'lightpink' : 'lightcyan';

  return (
    <div style={style}>
      <div>{player.name}</div>
      <div style={{ borderTop: '1px solid black' }}>{roleTitle}</div>
    </div>
  );
}

const mapStateToProps = (state) => {
  const { game, secrets, user } = state.gameRoomStore;
  return {
    game: new Game(game, secrets),
    user: new User(user)
  };
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(roundPlayActionCreators, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(AssassinationContainer);