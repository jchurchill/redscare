import { actionTypes } from '../constants/gameRoomConstants';

export function newRound(newState) {
  return { type: actionTypes.NEW_ROUND, newState };
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
    type: actionTypes.SUBMIT,
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