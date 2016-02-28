import React, { PropTypes } from 'react';
import _ from 'lodash';

export default class GameCreator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numPlayers: 5,
      includeSeer: false,
      includeSeerDeception: false,
      includeEvilMaster: false,
      includeRogueEvil: false
    };
  }

  onCheckboxChange(key, e) {
    this.setState({ [key]: e.target.checked });
  }

  onPlayersChange(e) {
    this.setState({ numPlayers: parseInt(e.target.value, 10) });
  }

  render() {
    const {
      numPlayers,
      includeSeer,
      includeSeerDeception,
      includeEvilMaster,
      includeRogueEvil
    } = this.state;

    const roleOptions = [
      { inputName: "include-seer", checked: includeSeer, key: "includeSeer",
        text: "Seer & assassin" },
      { inputName: "include-seer-deception", checked: includeSeerDeception, key: "includeSeerDeception",
        text: "Seer imposter & seer helper" },
      { inputName: "include-evil-master", checked: includeEvilMaster, key: "includeEvilMaster",
        text: "Evil master" },
      { inputName: "include-rogue-evil", checked: includeRogueEvil, key: "includeRogueEvil",
        text: "Renegade / unknown evil" }
    ];

    return (
      <div className="container">
        <form action="/games" method="post">
          <input type="text" placeholder="My game" name="game-name" />
          <div>
            Number of players:
            <select name="num-players" value={numPlayers} onChange={this.onPlayersChange.bind(this)}>
              {_.range(5,11).map(num => <option key={num} value={num}>{num}</option>)}
            </select>
          </div>
          <div>
            Select additional optional roles to include:
            {
              roleOptions.map(({ inputName, checked, text, key }) => {
                const onChange = this.onCheckboxChange.bind(this, key);
                return (
                  <div key={inputName}>
                    <label>
                      <input type="checkbox" name={inputName} checked={checked} onChange={onChange} />
                      {text}
                    </label>
                  </div>
                )
              })
            }
          </div>
        </form>
      </div>
    );
  }
}
