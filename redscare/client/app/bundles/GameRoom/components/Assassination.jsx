import React, { PropTypes } from 'react';

import Game from 'lib/game/gameHelper';
import { getRoleTitle } from 'lib/game/gameRules';
import User from 'lib/game/userHelper';

class Assassination extends React.Component {
  static propTypes = {
    game: PropTypes.instanceOf(Game).isRequired,
    user: PropTypes.instanceOf(User).isRequired,
    actions: PropTypes.shape({
      selectAssassinTarget: PropTypes.func.isRequired
    }).isRequired
  }

  selectAssassinTarget(targetUserId) {
    this.props.actions.selectAssassinTarget(targetUserId);
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

export default Assassination;