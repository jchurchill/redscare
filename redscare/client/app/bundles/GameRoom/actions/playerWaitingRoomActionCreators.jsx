import { actionTypes } from '../constants/gameRoomConstants';

export function joinRoom(user) {
  return { type: actionTypes.JOIN_ROOM, user };
}

export function leaveRoom(user) {
  return { type: actionTypes.LEAVE_ROOM, user };
}

export function startGame() {
  return { type: actionTypes.START_GAME };
}