import React, { PropTypes } from 'react';
import request from 'superagent';
import ActionForm from './ActionForm.jsx';
import css from './DevPanel.scss';

const gameActions = [

  ["join_room",   "Join game",         [] ],
  ["leave_room",  "Leave game",        [] ],
  ["start_game",  "Start game",        [] ],
  ["nominate",    "Nominate",          [{ name: "user_id", parse: x => parseInt(x, 10) }] ],

].map(action => ({
  actionName: action[0],
  actionDescription: action[1],
  parameters: action[2]
}));

class DevPanel extends React.Component {
  static PropTypes = {
    gameActionPath: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      gameContext: { gameId: null, userId: null }
    };
  }

  createUser(data) {
    console.log("create user", data);
  }

  onGameAction(action, data) {
    const requestData = {
      ...this.state.gameContext,
      gameEvent: action.actionName,
      data
    };
    request.post(this.props.gameActionPath)
      .send(requestData)
      .end((err, res) => {
        if (err) { console.error(err); }
        else {
          const result = res.body;
          this.onGameActionComplete(!err && result.success, action.actionName, requestData);
        }
      })
  }

  onGameActionComplete(success, actionName, data) {
    if (!success) {
      console.error("Failed:", actionName, data);
    }
    else {
      console.log("Succeeded:", actionName, data);
    }
  }

  onGameContextChange(contextName, e) {
    const context = { ...this.state.gameContext, [contextName]: parseInt(e.target.value, 10) };
    this.setState({ gameContext: context });
  }

  hasGameContext() {
    const { gameId, userId } = this.state.gameContext;
    return gameId && userId;
  }

  render() {
    return (
      <div>
        <h2>User</h2>
        <div>TODO: implement this</div>
        <ActionForm actionName="Create user" submit={this.createUser.bind(this)} disabled={true} parameters={[{name: "email"}, {name:"password"}]} />
        <h2>Game</h2>
        <div style={{ marginBottom: 5 }}>Context</div>
        <div style={{ marginBottom: 10 }}>
          <input type="number" placeholder="game_id" onChange={this.onGameContextChange.bind(this, "gameId")} />
          <input type="number" placeholder="acting_user_id" onChange={this.onGameContextChange.bind(this, "userId")} />
        </div>
        {gameActions.map(a => 
          <ActionForm
            key={a.actionName}
            actionName={a.actionDescription}
            submit={this.onGameAction.bind(this, a)}
            disabled={!this.hasGameContext()}
            parameters={a.parameters}
          />
        )}
      </div>
    );
  }
}

export default DevPanel