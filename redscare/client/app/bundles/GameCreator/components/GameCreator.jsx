import React, { PropTypes } from 'react';
import _ from 'lodash';

// Default role state when coming to page or resetting number of players
const defaultRoleState = {
  seer: { include: false, allow: true },
  seerDeception: { include: false, allow: false },
  evilMaster: { include: false, allow: false },
  rogueEvil: { include: false, allow: true }
},
roleSet = Object.keys(defaultRoleState);

export default class GameCreator extends React.Component {
  constructor(props) {
    super(props);
    this.state = Object.assign({ numPlayers: 5 }, defaultRoleState);
  }

  onCheckboxChange(key, e) {
    // For the changed checkbox, update its role's include state
    const checkedRoleState = Object.assign({}, this.state[key], { include: e.target.checked });
    this.setState(
      { [key]: checkedRoleState },
      () =>
        // Update what roles are allowed given the new current set of included roles.
        // Also, included is set to false if not allowed, else take current state
        this.setState(roleSet.reduce(
          (rolesState, roleKey) => {
            const curState = this.state[roleKey],
              allow = this.getIsAllowed(roleKey),
              include = allow && curState.include;
            return Object.assign(rolesState, { [roleKey]: { include, allow } });
          }, {})));
  }

  onPlayersChange(e) {
    // Set state for number of players, and reset roles completely
    const newState = Object.assign({ numPlayers: parseInt(e.target.value, 10) }, defaultRoleState);
    this.setState(newState);
  }

  // Given current state of selected roles, determine if role with the given key should be allowed
  // Logic: Allowed iff included || (dependencies are included && enough players in game)
  getIsAllowed(roleKey) {
    // Always allowed if already included
    if (this.state[roleKey].include) {
      return true;
    }

    // dependencies
    // SeerDeception & EvilMaster require seer to be included
    var dependenciesIncluded = true;
    switch(roleKey) {
      case "seerDeception":
      case "evilMaster":
        dependenciesIncluded = this.state["seer"].include;
        break;
    }

    if (!dependenciesIncluded) {
      return false;
    }

    // The number of total evil roles allowed in this game 
    const totalEvilRoleCount = this.getEvilRoleCount(this.state.numPlayers),
      // Each included option adds one evil role to the game
      currentEvilRoleCount = roleSet.reduce((sum, key) => sum + (this.state[key].include ? 1 : 0), 0);
    // Only allowed to include any new role if there are remaining evil roles
    // Note this assumes that every role selection includes exactly 1 evil,
    // and that evil players are the only constraining factor to the roles
    return currentEvilRoleCount < totalEvilRoleCount;
  }

  getEvilRoleCount(numPlayers) {
    switch(numPlayers) {
      case 5:
      case 6:
        return 2;
      case 7:
      case 8:
        return 3;
      case 9:
      case 10:
        return 4;
      default:
        throw "invalid player count"
    }
  }

  render() {
    const { numPlayers } = this.state;

    const roleOptions = [
      { inputName: "include-seer", key: "seer",
        text: "Seer & assassin" },
      { inputName: "include-seer-deception", key: "seerDeception",
        text: "Seer imposter & seer helper" },
      { inputName: "include-evil-master", key: "evilMaster",
        text: "Evil master" },
      { inputName: "include-rogue-evil", key: "rogueEvil",
        text: "Renegade / unknown evil" }
    ];

    return (
      <div className="container">
        <form action="/games" method="post">
          <input type="text" placeholder="Title for your game" name="game-name" />
          <div>
            Number of players:
            <select name="num-players" value={numPlayers} onChange={this.onPlayersChange.bind(this)}>
              {_.range(5,11).map(num => <option key={num} value={num}>{num}</option>)}
            </select>
          </div>
          <div>
            Select additional optional roles to include:
            {
              roleOptions.map(({ inputName, text, key }) => {
                const onChange = this.onCheckboxChange.bind(this, key),
                  roleState = this.state[key];
                return (
                  <div key={inputName}>
                    <label>
                      <input
                        type="checkbox"
                        name={inputName}
                        checked={roleState.include}
                        disabled={!roleState.allow}
                        onChange={onChange}
                      />
                      {text}
                    </label>
                  </div>
                )
              })
            }
          </div>
          <div>
            <button type="submit">Create game</button>
          </div>
        </form>
      </div>
    );
  }
}
