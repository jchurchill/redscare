import { actionTypes } from '../constants/gameRoomConstants';

export function updateConnectionStatus(connectionState) {
  return {
    type: actionTypes.CONNECTION_STATUS_UPDATED,
    connectionState
  };
}

export function stateUpdated(newState) {
  console.log("stateUpdated!");
  return { type: actionTypes.STATE_UPDATED, newState };
}