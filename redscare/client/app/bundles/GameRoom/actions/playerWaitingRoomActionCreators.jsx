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

export function playerJoined(newState) {
  return { type: actionTypes.PLAYER_JOINED, newState };
}

export function playerLeft(newState) {
  return { type: actionTypes.PLAYER_LEFT, newState };
}

export function gameStarted(newState) {
  return { type: actionTypes.GAME_STARTED, newState };
}