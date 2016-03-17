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

export function playerJoined(gamePlayers) {
  return { type: actionTypes.PLAYER_JOINED, gamePlayers };
}

export function playerLeft(gamePlayers) {
  return { type: actionTypes.PLAYER_LEFT, gamePlayers };
}

export function gameStarted(gameState) {
  return { type: actionTypes.GAME_STARTED, gameState };
}