import { actionTypes } from '../constants/gameRoomConstants';

export function nominate(nominationId, nomineeUserId) {
  return {
    type: actionTypes.NOMINATE,
    nominationId,
    nomineeUserId
  };
}

export function playerNominated(newGameState) {
  return {
    type: actionTypes.PLAYER_NOMINATED,
    newGameState
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

export function playerVoted(newGameState) {
  return {
    type: actionTypes.PLAYER_VOTED,
    newGameState
  };
}