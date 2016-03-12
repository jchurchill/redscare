import actionTypes from '../constants/gameRoomConstants';

export function joinRoom(gameId) {
  return { type: actionTypes.JOIN_ROOM, gameId };
}

export function leaveRoom(gameId) {
  return { type: actionTypes.LEAVE_ROOM, gameId };
}

export function startGame(gameId) {
  return { type: actionTypes.START_GAME, gameId };
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