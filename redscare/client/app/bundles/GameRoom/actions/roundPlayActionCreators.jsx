import { actionTypes } from '../constants/gameRoomConstants';

export function newRound(newState) {
  return { type: actionTypes.NEW_ROUND, newState };
}

export function newNomination(newState) {
  return { type: actionTypes.NEW_NOMINATION, newState };
}

export function nominate(nominationId, nomineeUserId) {
  return {
    type: actionTypes.NOMINATE,
    nominationId,
    nomineeUserId
  };
}

export function playerNominated(newState) {
  return { type: actionTypes.PLAYER_NOMINATED, newState };
}

export function votingStarted(newState) {
  return { type: actionTypes.VOTING_STARTED, newState };
}

export function vote(nominationId, currentUserId, upvote) {
  return {
    type: actionTypes.VOTE,
    nominationId,
    currentUserId,
    upvote
  };
}

export function playerVoted(newState) {
  return { type: actionTypes.PLAYER_VOTED, newState };
}