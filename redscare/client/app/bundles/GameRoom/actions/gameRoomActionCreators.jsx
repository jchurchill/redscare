import actionTypes from '../constants/gameRoomConstants';

export function updateConnectionStatus(connected) {
  return {
    type: actionTypes.CONNECTION_STATUS_UPDATED,
    connected
  };
}