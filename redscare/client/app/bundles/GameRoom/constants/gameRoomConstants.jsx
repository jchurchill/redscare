import mirrorCreator from 'mirror-creator';

export const actionTypes = mirrorCreator([
  'CONNECTION_STATUS_UPDATED', // Referring to websocket status
  'JOIN_ROOM', // When user chooses to join
  'LEAVE_ROOM', // When user chooses to leave
  'START_GAME', // When user (as room leader) starts the game
  'PLAYER_JOINED', // When server tells us someone else joined
  'PLAYER_LEFT', // When server tells us someone else left
  'GAME_STARTED', // When server tells us room leader started the game
]);

