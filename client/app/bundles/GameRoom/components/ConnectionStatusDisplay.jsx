import React, { PropTypes } from 'react';
import { connectionStates } from '../constants/gameRoomConstants';

class ConnectionStatusDisplay extends React.Component {
  static propTypes = {
    connectionState: PropTypes.string.isRequired
  }

  getDisplayText() {
    const { connectionState } = this.props
    switch (connectionState) {
      case connectionStates.CONNECTING: return "Connecting to server...";
      case connectionStates.CONNECTED: return "Connected to server!";
      case connectionStates.DISCONNECTED: return "Not connected to server.";
    }
  }

  getDisplayColor() {
    const { connectionState } = this.props
    switch (connectionState) {
      case connectionStates.CONNECTING: return 'white';
      case connectionStates.CONNECTED: return 'lightcyan';
      case connectionStates.DISCONNECTED: return 'lightpink';
    }
  }

  render() {
    return (
      <div style={{ marginTop: '10px', padding: '5px', backgroundColor: this.getDisplayColor() }}>
        {this.getDisplayText()}
      </div>
    );
  }
}

export default ConnectionStatusDisplay;
