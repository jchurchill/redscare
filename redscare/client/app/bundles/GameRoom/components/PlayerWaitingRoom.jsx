import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as playerWaitingRoomActionCreators from '../actions/playerWaitingRoomActionCreators';

class PlayerWaitingRoom extends React.Component {
  static propTypes = {
  };

  constructor(props, context) {
    super(props, context);
  }

  render() {
    const { name, gameIndexPath } = this.props.gameRoomStore
    return (
      <div>
        
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  return { gameRoomStore: state.gameRoomStore };
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(playerWaitingRoomActionCreators, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayerWaitingRoom);