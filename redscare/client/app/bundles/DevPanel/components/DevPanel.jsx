import React, { PropTypes } from 'react';
import request from 'superagent';
import ActionForm from './ActionForm.jsx';
import GameActionForm from './GameActionForm.jsx';
import Action from './action.js'
import css from './DevPanel.scss';
import gameActions from './gameActions';
import * as railsHelpers from 'lib/rails/railsHelpers'

class DevPanel extends React.Component {
  static PropTypes = {
    gameActionPath: PropTypes.string.isRequired,
    createUserPath: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      gameContext: { gameId: null, userId: null }
    };
  }

  createUser(data) {
    request.post(this.props.createUserPath)
      .send({ ...data, authenticity_token: railsHelpers.authToken() })
      .end((err, res) => {
        if (err) { console.error(err); }
        else {
          const result = res.body;
          if (result.success) { console.log('User successfully created.'); }
          else { console.error('User not created. Errors:', result.errors); }
        }
      })
  }

  onGameAction(action, data) {
    const requestData = {
      ...this.state.gameContext,
      authenticity_token: railsHelpers.authToken(),
      gameAction: action.actionName,
      data
    };
    request.post(this.props.gameActionPath)
      .send(requestData)
      .end((err, res) => {
        if (err) { console.error(err); }
        else {
          const result = res.body;
          this.onGameActionComplete(!err && result.success, action, requestData, result.gameState);
        }
      })
  }

  onGameActionComplete(success, action, requestData, gameState) {
    if (!success) {
      console.error("Failed:", action.actionName, requestData.data);
    }
    else {
      console.log("Succeeded:", action.actionName);
      console.log(">> New game state:", gameState);
    }
  }

  onGameContextChange(contextName, e) {
    const context = { ...this.state.gameContext, [contextName]: parseInt(e.target.value, 10) };
    this.setState({ gameContext: context });
  }

  hasGameContext() {
    const { gameId, userId } = this.state.gameContext;
    return gameId != null && userId != null;
  }

  render() {
    const createUserAction = new Action("create_user").withParam('email', 'string').withParam('password', 'string')
    return (
      <div>
        <h2>User</h2>
        <ActionForm action={createUserAction} submit={this.createUser.bind(this)} />
        <h2>Game</h2>
        <div style={{ marginBottom: 5 }}>Context</div>
        <div style={{ marginBottom: 10 }}>
          <input type="number" placeholder="game_id" onChange={this.onGameContextChange.bind(this, "gameId")} />
          <input type="number" placeholder="acting_user_id" onChange={this.onGameContextChange.bind(this, "userId")} />
        </div>
        {gameActions.map(action => 
          <GameActionForm
            key={action.actionName}
            action={action}
            submit={this.onGameAction.bind(this, action)}
            disabled={!this.hasGameContext()}
            contextUserId={this.state.gameContext.userId}
          />
        )}
      </div>
    );
  }
}

export default DevPanel