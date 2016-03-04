import React, { PropTypes } from 'react';
import _ from 'lodash';

// Default role state when coming to page or resetting number of players
const defaultRoleState = {
  seer: { include: false },
  seerDeception: { include: false },
  evilMaster: { include: false },
  rogueEvil: { include: false }
},
roleSet = Object.keys(defaultRoleState);

export default class GameCreator extends React.Component {
  constructor(props) {
    super(props);
    this.state = Object.assign({ numPlayers: 5 }, defaultRoleState);
  }

  onCheckboxChange(key, e) {
    // For the changed checkbox, update its role's include state
    this.setState({ [key]: { include: e.target.checked } });
  }

  onPlayersChange(e) {
    // Set state for number of players
    const numPlayers = parseInt(e.target.value, 10);
    var newState = { numPlayers };
    // If number of evil roles has decreased, reset role selection to default too
    if (this.getEvilRoleCount(numPlayers) < this.getEvilRoleCount(this.state.numPlayers)) {
      newState = Object.assign(newState, defaultRoleState);
    }
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
    const { createPath } = this.props;
    const roleOptions = [
      { key: "seer", inputName: "include-seer",  text: "Seer & assassin" },
      { key: "seerDeception", inputName: "include-seer-deception", text: "Seer imposter & seer helper" },
      { key: "evilMaster", inputName: "include-evil-master", text: "Evil master" },
      { key: "rogueEvil", inputName: "include-rogue-evil", text: "Renegade / unknown evil" }
    ];

    return (
      <div className="container">
        <form action={createPath} method="post">
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
                const { include } = this.state[key];
                return (
                  <div key={inputName}>
                    <label>
                      <input
                        type="checkbox"
                        name={inputName}
                        checked={include}
                        disabled={!this.getIsAllowed(key)}
                        onChange={this.onCheckboxChange.bind(this, key)}
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
