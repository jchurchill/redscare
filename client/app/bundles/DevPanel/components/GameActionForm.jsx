import React, { PropTypes } from 'react';
import ActionForm from './ActionForm.jsx';
import Action from './action.js'

class GameActionForm extends React.Component {
  static PropTypes = {
    submit: PropTypes.func.isRequired,
    action: PropTypes.instanceOf(GameAction).isRequired,
    disabled: PropTypes.bool,
    contextUserId: PropTypes.number.isRequired
  }

  constructor(props) {
    super(props);
  }

  // Intercept the submit; modify data to include the userId params from the game action
  onSubmit(data) {
    const { action, contextUserId, submit } = this.props
    action.userIdParameters.forEach(paramName => { data[paramName] = contextUserId; });
    submit(data);
  }

  render() {
    const { action, disabled } = this.props;
    return <ActionForm action={action} submit={this.onSubmit.bind(this)} disabled={disabled} />;
  }
}

class GameAction extends Action {
  constructor(actionName) {
    super(actionName);
    this._userIdParams = []
  }

  withContextUserId(name) {
    this._userIdParams.push(name);
    return this;
  }

  get userIdParameters() {
    return this._userIdParams.slice();
  }
}

export { GameAction };
export default GameActionForm;