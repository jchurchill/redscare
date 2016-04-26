import { actionTypes } from '../constants/gameRoomConstants';

export function updateConnectionStatus(connectionState) {
  return {
    type: actionTypes.CONNECTION_STATUS_UPDATED,
    connectionState
  };
}

export function stateUpdated(newState) {
  return { type: actionTypes.STATE_UPDATED, newState };
}

export function joinRoom(user) {
  return { type: actionTypes.JOIN_ROOM, user };
}

export function leaveRoom(user) {
  return { type: actionTypes.LEAVE_ROOM, user };
}

export function startGame() {
  return { type: actionTypes.START_GAME };
}

export function nominate(nominationId, nomineeUserId) {
  return {
    type: actionTypes.NOMINATE,
    nominationId,
    nomineeUserId
  };
}

export function vote(nominationId, currentUserId, upvote) {
  return {
    type: actionTypes.VOTE,
    nominationId,
    currentUserId,
    upvote
  };
}

export function missionSubmit(roundId, currentUserId) {
  return {
    type: actionTypes.MISSION_SUBMIT,
    roundId,
    currentUserId
  };
}

export function selectAssassinTarget(targetUserId) {
  return {
    type: actionTypes.SELECT_ASSASSIN_TARGET,
    targetUserId
  };
}