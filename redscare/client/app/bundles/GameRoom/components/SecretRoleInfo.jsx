import React, { PropTypes } from 'react';
import PlayerIcon from '../components/PlayerIcon';
import Game from 'lib/game/gameHelper';
import { getRoleTitle } from 'lib/game/gameRules';
import PlayerProvider from 'lib/game/playerProvider';

export default class SecretRoleInfo extends React.Component {
  static propTypes = {
    roleSecrets: PropTypes.shape({
      role: PropTypes.string.isRequired,
      roleInfo: PropTypes.object.isRequired
    }).isRequired,
    specialRules: PropTypes.shape({
      includesSeer: PropTypes.bool.isRequired,
      includesSeerDeception: PropTypes.bool.isRequired,
      includesRogueEvil: PropTypes.bool.isRequired,
      includesEvilMaster: PropTypes.bool.isRequired
    }).isRequired,
    playerProvider: PropTypes.instanceOf(PlayerProvider).isRequired
  };

  constructor(props, context) {
    super(props, context);
    this.state = { show: false }
  }

  toggleShow() {
    this.setState({ show: !this.state.show });
  }

  renderGoodNormal() {
    return "";
  }

  renderEvilNormal() {
    const {
      roleSecrets: { roleInfo: { known_evils } },
      specialRules: { includesRogueEvil },
      playerProvider
    } = this.props
    const knownEvilPlayers = known_evils.map(id => playerProvider.getPlayerById(id))
    return (
      <div>
        <div>Your fellow evil players:</div>
        { knownEvilPlayers.map(p => <PlayerIcon key={p.id} player={p} />) }
        {includesRogueEvil ? <div style={{ fontStyle: 'italic' }}>Note: does not include the rogue evil</div> : "" }
      </div>
    );
  }

  renderSeer() {
    const {
      roleSecrets: { roleInfo: { known_evils } },
      specialRules: { includesEvilMaster },
      playerProvider
    } = this.props
    const knownEvilPlayers = known_evils.map(id => playerProvider.getPlayerById(id))
    return (
      <div>
        <div>Your evil enemies:</div>
        { knownEvilPlayers.map(p => <PlayerIcon key={p.id} player={p} />) }
        {includesEvilMaster ? <div style={{ fontStyle: 'italic' }}>Note: does not include the evil master</div> : "" }
      </div>
    );
  }

  renderSeerKnower() {
    const {
      roleSecrets: { roleInfo: { possible_seers } },
      playerProvider
    } = this.props
    const possibleSeerPlayers = possible_seers.map(id => playerProvider.getPlayerById(id))
    return (
      <div>
        <div>The potential seers:</div>
        { possibleSeerPlayers.map(p => <PlayerIcon key={p.id} player={p} />) }
      </div>
    );
  }

  renderFalseSeer() {
    const {
      roleSecrets: { roleInfo: { known_evils } },
      specialRules: { includesRogueEvil },
      playerProvider
    } = this.props
    const knownEvilPlayers = known_evils.map(id => playerProvider.getPlayerById(id))
    return (
      <div>
        <div>Your fellow evil players:</div>
        { knownEvilPlayers.map(p => <PlayerIcon key={p.id} player={p} />) }
        {includesRogueEvil ? <div style={{ fontStyle: 'italic' }}>Note: does not include the rogue evil</div> : "" }
      </div>
    ); 
  }

  renderRogueEvil() {
    return ""
  }

  renderEvilMaster() {
    const {
      roleSecrets: { roleInfo: { known_evils } },
      specialRules: { includesRogueEvil },
      playerProvider
    } = this.props
    const knownEvilPlayers = known_evils.map(id => playerProvider.getPlayerById(id))
    return (
      <div>
        <div>Your fellow evil players:</div>
        { knownEvilPlayers.map(p => <PlayerIcon key={p.id} player={p} />) }
        {includesRogueEvil ? <div style={{ fontStyle: 'italic' }}>Note: does not include the rogue evil</div> : "" }
      </div>
    );
  }

  renderAssassin() {
    const {
      roleSecrets: { roleInfo: { known_evils } },
      specialRules: { includesRogueEvil },
      playerProvider
    } = this.props
    const knownEvilPlayers = known_evils.map(id => playerProvider.getPlayerById(id))
    return (
      <div>
        <div>Your fellow evil players:</div>
        { knownEvilPlayers.map(p => <PlayerIcon key={p.id} player={p} />) }
        {includesRogueEvil ? <div style={{ fontStyle: 'italic' }}>Note: does not include the rogue evil</div> : "" }
      </div>
    );
  }

  getRoleRenderInfo() {
    const { roleSecrets: { role }, specialRules } = this.props
    switch (role) {
      case Game.roles.GOOD_NORMAL:
        return {
          description: "You don't know much about anyone else. The only person you can really trust is yourself!",
          style: { backgroundColor: 'lightcyan' },
          renderOtherInfo: this.renderGoodNormal.bind(this)
        };
      case Game.roles.EVIL_NORMAL:
        return {
          description: specialRules.includesRogueEvil
            ? "You know who your fellow evil teammates are, other than the rogue evil."
            : "You know who your fellow evil teammates are.",
          style: { backgroundColor: 'lightpink' },
          renderOtherInfo: this.renderEvilNormal.bind(this)
        };
      case Game.roles.SEER:
        return {
          description: (specialRules.includesEvilMaster 
            ? "You can see everyone that is evil, other than the evil master."
            : "You can see everyone that is evil.")
              + " However, the assassin gets one guess at the end of the game to pick a person to kill. If they kill you, evil steals the win.",
          style: { backgroundColor: 'lightcyan' },
          renderOtherInfo: this.renderSeer.bind(this)
        };
      case Game.roles.SEER_KNOWER:
        return {
          description: "You can see the seer (who is good) and the false seer (who is evil), but don't know who is who.",
          style: { backgroundColor: 'lightcyan' },
          renderOtherInfo: this.renderSeerKnower.bind(this)
        };
      case Game.roles.FALSE_SEER:
        return {
          description: "The seer-knower has seen you and the seer, but doesn't know who is false (and evil) and who is real (and good).",
          style: { backgroundColor: 'lightpink' },
          renderOtherInfo: this.renderFalseSeer.bind(this)
        };
      case Game.roles.ROGUE_EVIL:
        return {
          description: "You're evil, but don't know who else is... and they don't know that you are either.",
          style: { backgroundColor: 'lightpink' },
          renderOtherInfo: this.renderRogueEvil.bind(this)
        };
      case Game.roles.ASSASSIN:
        return {
          description: "If good wins, take one guess at who the seer is, and steal back the win if you are correct.",
          style: { backgroundColor: 'lightpink' },
          renderOtherInfo: this.renderAssassin.bind(this)
        };
      case Game.roles.EVIL_MASTER:
        return {
          description: "You are the one evil character that the seer cannot see.",
          style: { backgroundColor: 'lightpink' },
          renderOtherInfo: this.renderAssassin.bind(this)
        };
      default:
        throw { message: "unrecognized role" };
    }
  }

  getRoleTitle() {
    const { roleSecrets: { role } } = this.props;
    return getRoleTitle(role);
  }

  render() {
    const { name, description, style, renderOtherInfo } = this.getRoleRenderInfo();
    const { show } = this.state;
    if (show) {
      return (
        <div style={{ margin: '5px', padding: '5px', border: '1px solid black', ...style }}>
          <div>You are...</div>
          <h3>{this.getRoleTitle()}</h3>
          <div style={{ marginBottom: '10px' }}>{description}</div>
          {renderOtherInfo()}
          <a href="#" onClick={this.toggleShow.bind(this)}>
            Click to hide
          </a>
        </div>
      )
    }
    else {
      return (
        <a href="#" onClick={this.toggleShow.bind(this)}>
          Click to show your identity
        </a>
      )
    }
  }
}