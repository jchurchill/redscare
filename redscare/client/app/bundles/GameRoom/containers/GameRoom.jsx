import React, { PropTypes } from 'react';
import GameRoomContainer from '../components/GameRoomContainer';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Immutable from 'immutable';
import * as gameRoomActionCreators from '../actions/gameRoomActionCreators';

// Simple example of a React "smart" component
class GameRoom extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,

    // This corresponds to the value used in function select above.
    // We prefix all property and variable names pointing to Immutable.js objects with '$$'.
    // This allows us to immediately know we don't call $$gameRoomStore['someProperty'], but
    // instead use the Immutable.js `get` API for Immutable.Map
    $$gameRoomStore: PropTypes.instanceOf(Immutable.Map).isRequired,
  };

  constructor(props, context) {
    super(props, context);
  }

  render() {
    const { dispatch, $$gameRoomStore } = this.props;
    const actions = bindActionCreators(gameRoomActionCreators, dispatch);
    const { updateName } = actions;
    const name = $$gameRoomStore.get('name');
    const gameIndexPath = $$gameRoomStore.get('gameIndexPath');

    return (
      <GameRoomContainer {...{ gameIndexPath, updateName, name }} />
    );
  }
}

// Don't forget to actually use connect!
// Note that we don't export GameRoom, but the redux "connected" version of it.
// See https://github.com/reactjs/react-redux/blob/master/docs/api.md#examples
export default connect(
  (state) => {
    // Which part of the Redux global state does our component want to receive as props?
    // Note the use of `$$` to prefix the property name because the value is of type Immutable.js
    return { $$gameRoomStore: state.$$gameRoomStore };
  })
  (GameRoom);
