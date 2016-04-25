import mirrorCreator from 'mirror-creator';

export const actionTypes = mirrorCreator([
  'CONNECTION_STATUS_UPDATED', // Referring to websocket status

  'JOIN_ROOM', // When user chooses to join
  'LEAVE_ROOM', // When user chooses to leave
  'START_GAME', // When user (as room leader) starts the game
  'PLAYER_JOINED', // When server tells us someone else joined
  'PLAYER_LEFT', // When server tells us someone else left

  'STATE_UPDATED', // When server sends us the full game state after another player takes an action

  'NOMINATE', // When user (as round leader) nominates a player
  'VOTE', // When user upvotes or downvotes a nomination
  'SUBMIT', // When user operative submits pass / fail for a round
  'SELECT_ASSASSIN_TARGET', // When assassin selects target to kill
]);

export const connectionStates = mirrorCreator([
  'CONNECTING',
  'CONNECTED',
  'DISCONNECTED'
]);